import { sequelize, Order, OrderItem, Product } from '../../../../../database/associations.js';
import { ORDER_STATUS, PAYMENT_STATUS } from '../models/order.model.js';
import { NotFoundError, BadRequestError } from '../../../../../middlewares/errorHandler.js';

export class CancelOrderService {
  /**
   * Cancels order and atomically restocks inventory inside an ACID transaction
   */
  async execute(orderId) {
    console.log(`[CancelOrderService]: Cancelling order ${orderId} & restocking inventory...`);

    try {
      const cancelledOrder = await sequelize.transaction(async (t) => {
        // 1. Lock the Order row exclusively (Single table query -> Clean PostgreSQL SELECT ... FOR UPDATE)
        const order = await Order.findByPk(orderId, {
          lock: t.LOCK.UPDATE,
          transaction: t,
        });

        if (!order) {
          throw new NotFoundError(`Order with ID '${orderId}' was not found.`);
        }

        // 2. Validate state machine transitions
        if (order.status === ORDER_STATUS.CANCELLED) {
          throw new BadRequestError(`Order '${orderId}' is already cancelled.`);
        }

        if (order.status === ORDER_STATUS.SHIPPED || order.status === ORDER_STATUS.COMPLETED) {
          throw new BadRequestError(`Cannot cancel order in '${order.status}' status. Item has already been dispatched.`);
        }

        // 3. Fetch associated line items for restocking within transaction
        const orderItems = await OrderItem.findAll({
          where: { orderId: order.id },
          transaction: t,
        });

        // 4. Atomically Restock Inventory for each product
        for (const item of orderItems) {
          await Product.increment('stock', {
            by: item.quantity,
            where: { id: item.productId },
            transaction: t,
          });
          console.log(`[CancelOrderService]: Restocked ${item.quantity} units for Product ${item.productId}`);
        }

        // 5. Update Order Status
        order.status = ORDER_STATUS.CANCELLED;
        if (order.paymentStatus === PAYMENT_STATUS.PAID) {
          order.paymentStatus = PAYMENT_STATUS.REFUNDED;
        }

        await order.save({ transaction: t });
        return order;
      });

      console.log(`[CancelOrderService]: Order ${orderId} cancelled & restocked successfully.`);
      return cancelledOrder;
    } catch (error) {
      console.error(`[CancelOrderService Error] for Order ${orderId}:`, error.message);
      throw error;
    }
  }
}

export const cancelOrderService = new CancelOrderService();
