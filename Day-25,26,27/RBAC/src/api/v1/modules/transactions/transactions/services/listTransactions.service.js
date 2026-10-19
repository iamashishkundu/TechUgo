const { models } = require('@db');

const { Transaction, User, Order } = models;

module.exports = async function listTransactions({
  userId,
  type,
  direction,
  status,
  page = 1,
  limit = 20
} = {}) {
  const where = {};
  if (userId) where.userId = userId;
  if (type) where.type = type;
  if (direction) where.direction = direction;
  if (status) where.status = status;

  const offset = (Number(page) - 1) * Number(limit);

  const { rows, count } = await Transaction.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'email']
      },
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
