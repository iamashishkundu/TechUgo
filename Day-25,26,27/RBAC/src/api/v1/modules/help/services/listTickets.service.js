const { models } = require('@db');

const { Ticket, User, TicketMessage } = models;

module.exports = async function listTickets({
  status,
  priority,
  userId,
  page = 1,
  limit = 20
} = {}) {
  const where = {};
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (userId) where.userId = userId;

  const offset = (Number(page) - 1) * Number(limit);

  const { rows, count } = await Ticket.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'email']
      }
    ],
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
