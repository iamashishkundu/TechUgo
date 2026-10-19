const { models } = require('@db');

const { Ticket } = models;

module.exports = async function listMyTickets({ userId, page = 1, limit = 20 } = {}) {
  const offset = (Number(page) - 1) * Number(limit);

  const { rows, count } = await Ticket.findAndCountAll({
    where: { userId },
    order: [['lastMessageAt', 'DESC']],
    limit: Number(limit),
    offset
  });

  return {
    tickets: rows,
    pagination: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit))
    }
  };
};
