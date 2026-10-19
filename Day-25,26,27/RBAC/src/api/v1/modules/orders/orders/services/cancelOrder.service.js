const { sequelize, models } = require('@db');
const ApiError = require('@utils/ApiError');
const { ORDER_STATUS } = require('@constants/orderStatus');
const restoreStock = require('@v1/modules/inventory/stock/services/restoreStock.service');
const refundOrder = require('./refundOrder.service');
const recordStatusHistory = require('./recordStatusHistory.service');
const createNotification = require('@v1/modules/notifications/services/createNotification.service');

const { Order, OrderItem } = models;

module.exports = async function cancelOrder({ orderId, userId, reason = 'Cancelled by customer' }) {
  const order = await Order.findOne({
    where: { id: orderId, userId },
    include: [{ model: OrderItem, as: 'items' }]
  });

  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  if (order.status !== ORDER_STATUS.PENDING) {
    throw ApiError.conflict(`Cannot cancel order in "${order.status}" status. Only pending orders can be cancelled by user.`);
  }

  await sequelize.transaction(async (t) => {
    // 1. Restore stock
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        await restoreStock({
          variantId: item.variantId,
          quantity: item.quantity,
          referenceType: 'order',
          referenceId: order.id,
          note: `Restored due to order cancellation: ${order.orderNumber}`,
          type: 'cancellation',
          transaction: t
        });
      }
    }

    // 2. Refund wallet
    await refundOrder({ order, transaction: t });

    // 3. Update order
    const fromStatus = order.status;
    await order.update(
      {
        status: ORDER_STATUS.CANCELLED,
        cancelledAt: new Date(),
        cancelReason: reason
      },
      { transaction: t }
    );

    // 4. Record status history
    await recordStatusHistory({
      orderId: order.id,
      fromStatus,
      toStatus: ORDER_STATUS.CANCELLED,
      changedByType: 'user',
      changedById: userId,
      note: reason,
      transaction: t
    });
  });

  // 5. Notify customer
  try {
    await createNotification({
      recipientType: 'user',
      recipientId: userId,
      type: 'order_cancelled',
      title: 'Order Cancelled',
      body: `Your order #${order.orderNumber} has been cancelled and refunded to your wallet.`
    });
  } catch {
    // failure logged only
  }

  return await Order.findByPk(order.id, {
    include: [{ model: OrderItem, as: 'items' }]
  });
};
