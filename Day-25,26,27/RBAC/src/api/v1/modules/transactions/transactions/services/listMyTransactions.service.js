const { models } = require('@db');

const { Transaction, Order } = models;

module.exports = async function listMyTransactions({ userId, page = 1, limit = 20 } = {}) {
  const offset = (Number(page) - 1) * Number(limit);

  const { rows, count } = await Transaction.findAndCountAll({
    where: { userId },
    include: [
      {
        model: Order,
        as: 'order',
        attributes: ['id', 'orderNumber', 'total']
      }
    ],
    order: [['createdAt', 'DESC']],
    limit: Number(limit),
    offset
  });

  return {
    transactions: rows,
    pagination: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit))
    }
  };
};
