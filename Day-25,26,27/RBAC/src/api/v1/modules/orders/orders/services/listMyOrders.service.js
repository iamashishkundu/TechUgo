const { models } = require('@db');

const { Order, OrderItem } = models;

module.exports = async function listMyOrders({ userId, page = 1, limit = 20 } = {}) {
  const offset = (Number(page) - 1) * Number(limit);

  const { rows, count } = await Order.findAndCountAll({
    where: { userId },
    include: [
      {
        model: OrderItem,
        as: 'items'
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
