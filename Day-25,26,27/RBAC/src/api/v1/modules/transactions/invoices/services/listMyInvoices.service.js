const { models } = require('@db');

const { Invoice, Order } = models;

module.exports = async function listMyInvoices({ userId, page = 1, limit = 20 } = {}) {
  const offset = (Number(page) - 1) * Number(limit);

  const { rows, count } = await Invoice.findAndCountAll({
    where: { userId },
    include: [
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
