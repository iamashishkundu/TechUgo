const { sequelize, models } = require('@db');
const ApiError = require('@utils/ApiError');
const { generateOrderNumber } = require('@utils/orderNumber');
const { ORDER_STATUS, ORDER_PAYMENT_STATUS } = require('@constants/orderStatus');

const calculateOrderTotals = require('./calculateOrderTotals.service');
const recordStatusHistory = require('./recordStatusHistory.service');
const deductStock = require('@v1/modules/inventory/stock/services/deductStock.service');
const debitWallet = require('@v1/modules/wallet/services/debitWallet.service');
const recordTransaction = require('@v1/modules/transactions/transactions/services/recordTransaction.service');
const validateCoupon = require('@v1/modules/orders/coupons/services/validateCoupon.service');
const createInvoice = require('@v1/modules/transactions/invoices/services/createInvoice.service');
const clearCart = require('@v1/modules/orders/cart/services/clearCart.service');
const createNotification = require('@v1/modules/notifications/services/createNotification.service');
const notifyAdmins = require('@v1/modules/notifications/services/notifyAdmins.service');

const { Cart, CartItem, ProductVariant, Product, Address, Order, OrderItem, CouponUsage, Wallet, User } = models;

module.exports = async function placeOrder({ userId, addressId }) {
  // Step 1: Load cart
  const cart = await Cart.findOne({
    where: { userId },
    include: [{ model: CartItem, as: 'items' }]
  });

  if (!cart || !cart.items || cart.items.length === 0) {
    throw ApiError.badRequest('Cart is empty');
  }

  // Load user
  const user = await User.findByPk(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Step 3: Load shipping address
  const address = await Address.findOne({
    where: { id: addressId, userId }
  });

  if (!address) {
    throw ApiError.badRequest('Invalid shipping address');
  }

  const shippingAddressSnapshot = {
    id: address.id,
    label: address.label,
    recipientName: address.recipientName,
    phone: address.phone,
    line1: address.line1,
    line2: address.line2,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country
  };

  const lowStockAlerts = [];
  let placedOrderResult = null;

  await sequelize.transaction(async (t) => {
    // Step 2: Lock involved variants ordered by ID (deadlock prevention)
    const variantIds = cart.items.map((i) => i.variantId).sort();

    const variants = await ProductVariant.findAll({
      where: { id: variantIds },
      include: [{ model: Product, as: 'product', required: true }],
      order: [['id', 'ASC']],
      lock: t.LOCK.UPDATE,
      transaction: t
    });

    const variantMap = new Map();
    for (const v of variants) {
      variantMap.set(v.id, v);
    }

    const itemsForCalculation = [];
    for (const cartItem of cart.items) {
      const variant = variantMap.get(cartItem.variantId);
      if (!variant || !variant.isActive || !variant.product || !variant.product.isActive) {
        throw ApiError.conflict(`Product variant is inactive or unavailable`);
      }

      if (Number(variant.stock) < Number(cartItem.quantity)) {
        throw ApiError.conflict(
          `INSUFFICIENT_STOCK: Item "${variant.product.name} (${variant.sku})" does not have enough stock`
        );
      }

      itemsForCalculation.push({
        variant,
        quantity: cartItem.quantity
      });
    }

    // Step 4: Calculate totals & coupon
    let coupon = null;
    let validatedCouponData = null;

    if (cart.couponCode) {
      // Preliminary subtotal to validate coupon
      const preliminaryTotals = calculateOrderTotals({ items: itemsForCalculation });
      validatedCouponData = await validateCoupon({
        code: cart.couponCode,
        userId,
        subtotal: preliminaryTotals.subtotal,
        lock: true,
        transaction: t
      });
      coupon = validatedCouponData.coupon;
    }

    const totals = calculateOrderTotals({
      items: itemsForCalculation,
      coupon
    });

    // Step 5: Lock user wallet FOR UPDATE & verify balance
    const wallet = await Wallet.findOne({
      where: { userId },
      lock: t.LOCK.UPDATE,
      transaction: t
    });

    if (!wallet) {
      throw ApiError.notFound('Wallet not found');
    }

    if (Number(wallet.balance) < Number(totals.total)) {
      throw ApiError.badRequest('INSUFFICIENT_WALLET_BALANCE');
    }

    // Step 6: Create order & order items
    const orderNumber = generateOrderNumber();
    const order = await Order.create(
      {
        orderNumber,
        userId,
        status: ORDER_STATUS.PENDING,
        paymentStatus: ORDER_PAYMENT_STATUS.PAID,
        subtotal: totals.subtotal,
        discountAmount: totals.discountAmount,
        total: totals.total,
        couponId: coupon ? coupon.id : null,
        shippingAddress: shippingAddressSnapshot,
        placedAt: new Date()
      },
      { transaction: t }
    );

    // Create order items
    for (const item of totals.itemsWithPricing) {
      await OrderItem.create(
        {
          orderId: order.id,
          variantId: item.variantId,
          productName: item.productName,
          variantSku: item.variantSku,
          variantAttributes: item.variantAttributes,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          lineTotal: item.lineTotal
        },
        { transaction: t }
      );
    }

    // Record initial status history (null -> pending)
    await recordStatusHistory({
      orderId: order.id,
      fromStatus: null,
      toStatus: ORDER_STATUS.PENDING,
      changedByType: 'user',
      changedById: userId,
      note: 'Order placed',
      transaction: t
    });

    // Step 7: Deduct stock for each variant
    for (const item of cart.items) {
      const deduction = await deductStock({
        variantId: item.variantId,
        quantity: item.quantity,
        referenceType: 'order',
        referenceId: order.id,
        transaction: t
      });

      if (deduction.isLowStock) {
        lowStockAlerts.push({
          variantId: item.variantId,
          sku: deduction.sku,
          stock: deduction.newStock
        });
      }
    }

    // Step 8: Debit wallet and record transaction
    const { entry: walletEntry } = await debitWallet({
      walletId: wallet.id,
      amount: totals.total,
      source: 'order_payment',
      referenceType: 'order',
      referenceId: order.id,
      note: `Payment for order ${order.orderNumber}`,
      createdByType: 'user',
      createdById: userId,
      transaction: t
    });

    await recordTransaction({
      userId,
      type: 'order_payment',
      direction: 'debit',
      amount: totals.total,
      status: 'success',
      orderId: order.id,
      walletEntryId: walletEntry.id,
      description: `Payment for order ${order.orderNumber}`,
      transaction: t
    });

    // Step 9: If coupon used, record usage & increment usedCount
    if (coupon) {
      await CouponUsage.create(
        {
          couponId: coupon.id,
          userId,
          orderId: order.id
        },
        { transaction: t }
      );

      await coupon.increment('usedCount', { by: 1, transaction: t });
    }

    // Step 10: Create invoice
    await createInvoice({
      orderId: order.id,
      userId,
      subtotal: totals.subtotal,
      discountAmount: totals.discountAmount,
      total: totals.total,
      snapshot: {
        customer: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone
        },
        address: shippingAddressSnapshot,
        items: totals.itemsWithPricing
      },
      transaction: t
    });

    // Step 11: Clear cart
    await clearCart({ userId, transaction: t });

    placedOrderResult = await Order.findByPk(order.id, {
      include: [
        { model: OrderItem, as: 'items' }
      ],
      transaction: t
    });
  });

  // Step 12: After commit notifications (logged, never rolling back order)
  try {
    await createNotification({
      recipientType: 'user',
      recipientId: userId,
      type: 'order_placed',
      title: 'Order Placed Successfully',
      body: `Your order #${placedOrderResult.orderNumber} has been placed. Total: ${placedOrderResult.total} minor units.`,
      data: { orderId: placedOrderResult.id, orderNumber: placedOrderResult.orderNumber }
    });
  } catch {
    // Failure to notify customer logged only
  }

  for (const alert of lowStockAlerts) {
    try {
      await notifyAdmins({
        permission: 'inventory:view',
        type: 'low_stock',
        title: 'Low Stock Alert',
        body: `Variant SKU "${alert.sku}" has reached low stock threshold (${alert.stock} remaining)`,
        data: alert
      });
    } catch {
      // Failure to notify admin logged only
    }
  }

  return placedOrderResult;
};
