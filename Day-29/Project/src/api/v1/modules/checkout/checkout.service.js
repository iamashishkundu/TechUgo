import { sequelize, User, Product, Order, OrderItem } from '../../../../database/associations.js';
import { ORDER_STATUS, PAYMENT_STATUS } from '../orders/models/order.model.js';
import {
  NotFoundError,
  BadRequestError,
  InsufficientStockError,
} from '../../../../middlewares/errorHandler.js';

export class CheckoutService {
  /**
   * Executes atomic checkout with ACID transaction and pessimistic row locking
   *
   * @param {Object} payload
   * @param {string} payload.userId - UUID of purchasing user
   * @param {Array<{productId: string, quantity: number}>} payload.items - Line items
   * @returns {Promise<Object>} Created order with receipt details
   */
  async processCheckout({ userId, items }) {
    console.log(`[CheckoutService]: Initiating checkout for User: ${userId} (${items.length} items)...`);

    try {
      // 1. Managed Sequelize ACID Transaction
      // If any error occurs or is thrown inside this callback, Sequelize automatically executes ROLLBACK.
      // If the callback finishes normally, Sequelize automatically executes COMMIT.
      const checkoutResult = await sequelize.transaction(async (t) => {
        // 2. Validate User Existence
        const user = await User.findByPk(userId, { transaction: t });
        if (!user) {
          throw new NotFoundError(`User with ID '${userId}' does not exist.`);
        }

        // 3. Deadlock Prevention Strategy
        // Sort product IDs deterministically (lexicographical order) across concurrent requests
        // to prevent circular-wait lock deadlocks between simultaneous transactions.
        const sortedItems = [...items].sort((a, b) => a.productId.localeCompare(b.productId));
        const productIds = sortedItems.map((item) => item.productId);

        // 4. Pessimistic Row-Level Locking (SELECT ... FOR UPDATE)
        // Locks the selected product rows until transaction COMMIT or ROLLBACK.
        // Any concurrent checkout requesting these same products will wait until this lock is released.
        const lockedProducts = await Product.findAll({
          where: { id: productIds },
          lock: t.LOCK.UPDATE,
          transaction: t,
        });

        // 5. Verify All Products Exist
        const productMap = new Map(lockedProducts.map((p) => [p.id, p]));
        for (const item of sortedItems) {
          const product = productMap.get(item.productId);
          if (!product) {
            throw new NotFoundError(`Product with ID '${item.productId}' does not exist.`);
          }
          if (!product.isActive) {
            throw new BadRequestError(`Product '${product.title}' (SKU: ${product.sku}) is currently inactive and cannot be ordered.`);
          }
        }

        // 6. Stock Sufficiency Check & Price Calculation (Strictly Using DB Prices)
        let totalAmount = 0;
        const lineItemsToInsert = [];

        for (const item of sortedItems) {
          const product = productMap.get(item.productId);

          // Inventory Integrity Check
          if (product.stock < item.quantity) {
            throw new InsufficientStockError(product.title, item.quantity, product.stock);
          }

          // Compute subtotal from DB price (never trust client)
          const unitPrice = Number(product.price);
          const subtotal = Number((unitPrice * item.quantity).toFixed(2));
          totalAmount = Number((totalAmount + subtotal).toFixed(2));

          lineItemsToInsert.push({
            productId: product.id,
            quantity: item.quantity,
            unitPrice: unitPrice,
            subtotal: subtotal,
            // Keep reference to product model instance for decrementing
            _productInstance: product,
          });
        }

        // 7. Insert Order Record
        const order = await Order.create(
          {
            userId,
            totalAmount,
            status: ORDER_STATUS.PENDING,
            paymentStatus: PAYMENT_STATUS.UNPAID,
          },
          { transaction: t }
        );

        // 8. Bulk Insert Order Items with Order Foreign Key
        const orderItemsPayload = lineItemsToInsert.map((line) => ({
          orderId: order.id,
          productId: line.productId,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          subtotal: line.subtotal,
        }));

        const createdOrderItems = await OrderItem.bulkCreate(orderItemsPayload, {
          transaction: t,
          returning: true,
        });

        // 9. Decrement Inventory for Each Product
        for (const line of lineItemsToInsert) {
          await line._productInstance.decrement('stock', {
            by: line.quantity,
            transaction: t,
          });
        }

        console.log(`[CheckoutService]: Order ${order.id} staged successfully. Total: $${totalAmount}. Committing transaction...`);

        return {
          order,
          items: createdOrderItems.map((i) => {
            const product = productMap.get(i.productId);
            return {
              productId: i.productId,
              title: product?.title || null,
              sku: product?.sku || null,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
              subtotal: i.subtotal,
            };
          }),
        };
      });

      console.log(`[CheckoutService]: Transaction COMMITTED. Order ${checkoutResult.order.id} confirmed.`);

      return {
        orderId: checkoutResult.order.id,
        userId: checkoutResult.order.userId,
        status: checkoutResult.order.status,
        paymentStatus: checkoutResult.order.paymentStatus,
        totalAmount: checkoutResult.order.totalAmount,
        items: checkoutResult.items,
        createdAt: checkoutResult.order.createdAt,
      };
    } catch (error) {
      console.error('[CheckoutService Error]: Transaction ROLLED BACK. Error:', error.message);
      // Re-throw so Express errorHandler middleware sends appropriate status & message to client
      throw error;
    }
  }
}

export const checkoutService = new CheckoutService();
