const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Order, User, OrderItem, Coupon, OrderStatusHistory, Invoice } = models;

module.exports = async function getOrder({ orderId }) {
  const order = await Order.findByPk(orderId, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'email', 'phone']
      },
      {
        model: OrderItem,
        as: 'items'
      },
      {
        model: Coupon,
        as: 'coupon'
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
