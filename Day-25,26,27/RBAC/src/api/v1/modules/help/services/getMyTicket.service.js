const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Ticket, TicketMessage } = models;

module.exports = async function getMyTicket({ userId, ticketId }) {
  const ticket = await Ticket.findOne({
    where: { id: ticketId, userId },
    include: [
      {
        model: TicketMessage,
        as: 'messages',
        order: [['createdAt', 'ASC']]
      }
    ]
  });

  if (!ticket) {
    throw ApiError.notFound('Ticket not found');
  }

  return ticket;
};
