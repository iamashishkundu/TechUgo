const { models } = require('@db');

const { Invoice, User, Order } = models;

module.exports = async function listInvoices({ userId, orderId, page = 1, limit = 20 } = {}) {
  const where = {};
  if (userId) where.userId = userId;
  if (orderId) where.orderId = orderId;

  const offset = (Number(page) - 1) * Number(limit);

  const { rows, count } = await Invoice.findAndCountAll({
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
        attributes: ['id', 'orderNumber', 'status', 'total']
      }
    ],
    order: [['issuedAt', 'DESC']],
    limit: Number(limit),
    offset
  });

  return {
    invoices: rows,
    pagination: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit))
    }
  };
};
