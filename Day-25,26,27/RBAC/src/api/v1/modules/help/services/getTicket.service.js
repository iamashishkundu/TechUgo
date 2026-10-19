const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Ticket, User, TicketMessage } = models;

module.exports = async function getTicket({ ticketId }) {
  const ticket = await Ticket.findByPk(ticketId, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'email', 'phone']
      },
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
