const { models } = require('@db');

const { Order, User, OrderItem, Coupon } = models;

module.exports = async function listOrders({
  status,
  userId,
  orderNumber,
  page = 1,
  limit = 20
} = {}) {
  const where = {};
  if (status) where.status = status;
  if (userId) where.userId = userId;
  if (orderNumber) where.orderNumber = orderNumber;

  const offset = (Number(page) - 1) * Number(limit);

  const { rows, count } = await Order.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'email']
      },
      {
        model: OrderItem,
        as: 'items'
      },
      {
        model: Coupon,
        as: 'coupon',
        attributes: ['id', 'code', 'discountType', 'discountValue']
      }
    ],
    order: [['createdAt', 'DESC']],
    limit: Number(limit),
    offset,
    distinct: true
  });

  return {
    orders: rows,
    pagination: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit))
    }
  };
};
