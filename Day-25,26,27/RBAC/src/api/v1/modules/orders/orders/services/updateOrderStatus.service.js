const { sequelize, models } = require('@db');
const ApiError = require('@utils/ApiError');
const { ORDER_STATUS, ALLOWED_ORDER_TRANSITIONS } = require('@constants/orderStatus');
const restoreStock = require('@v1/modules/inventory/stock/services/restoreStock.service');
const refundOrder = require('./refundOrder.service');
const recordStatusHistory = require('./recordStatusHistory.service');
const createNotification = require('@v1/modules/notifications/services/createNotification.service');

const { Order, OrderItem, OrderStatusHistory } = models;

module.exports = async function updateOrderStatus({
  orderId,
  status: newStatus,
  note = null,
  actorType = 'admin',
  actorId = null
}) {
  const order = await Order.findByPk(orderId, {
    include: [{ model: OrderItem, as: 'items' }]
  });

  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  const allowedNext = ALLOWED_ORDER_TRANSITIONS[order.status] || [];
  if (!allowedNext.includes(newStatus)) {
    throw ApiError.conflict(
      `INVALID_STATUS_TRANSITION: Cannot transition order from "${order.status}" to "${newStatus}"`
    );
  }

  const fromStatus = order.status;

  await sequelize.transaction(async (t) => {
    // Handling specific transitions
    if (newStatus === ORDER_STATUS.CANCELLED) {
      if (order.items && order.items.length > 0) {
        for (const item of order.items) {
          await restoreStock({
            variantId: item.variantId,
            quantity: item.quantity,
            referenceType: 'order',
            referenceId: order.id,
            note: `Stock restored on cancellation of order #${order.orderNumber}`,
            type: 'cancellation',
            transaction: t
          });
        }
      }
      await refundOrder({ order, transaction: t });
      order.cancelledAt = new Date();
      order.cancelReason = note || 'Cancelled by staff';
    } else if (newStatus === ORDER_STATUS.RETURNED) {
      if (order.items && order.items.length > 0) {
        for (const item of order.items) {
          await restoreStock({
            variantId: item.variantId,
            quantity: item.quantity,
            referenceType: 'order',
            referenceId: order.id,
            note: `Stock restored on return of order #${order.orderNumber}`,
            type: 'return',
            transaction: t
          });
        }
      }
    } else if (newStatus === ORDER_STATUS.REFUNDED) {
      await refundOrder({ order, transaction: t });
    }

    order.status = newStatus;
    await order.save({ transaction: t });

    await recordStatusHistory({
      orderId: order.id,
      fromStatus,
      toStatus: newStatus,
      changedByType: actorType,
      changedById: actorId,
      note,
      transaction: t
    });
  });

  // Notify customer of status change
  try {
    await createNotification({
      recipientType: 'user',
      recipientId: order.userId,
      type: 'order_status_updated',
      title: 'Order Status Updated',
      body: `Your order #${order.orderNumber} status changed to ${newStatus}.`
    });
  } catch {
    // failure logged only
  }

  return await Order.findByPk(order.id, {
    include: [
      { model: OrderItem, as: 'items' },
      { model: OrderStatusHistory, as: 'statusHistory' }
    ]
  });
};
