const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Order, OrderItem, OrderStatusHistory, Invoice } = models;

module.exports = async function getMyOrder({ userId, orderId }) {
  const order = await Order.findOne({
    where: { id: orderId, userId },
    include: [
      {
        model: OrderItem,
        as: 'items'
      },
      {
        model: OrderStatusHistory,
        as: 'statusHistory',
        order: [['createdAt', 'ASC']]
      },
      {
        model: Invoice,
        as: 'invoice'
      }
    ]
  });

  if (!order) {
    throw ApiError.notFound('Order not found');
  }

  return order;
};
