const { models } = require('@db');
const ApiError = require('@utils/ApiError');
const { TICKET_STATUS } = require('@constants/ticketStatus');
const notifyAdmins = require('@v1/modules/notifications/services/notifyAdmins.service');

const { Ticket, TicketMessage } = models;

module.exports = async function closeMyTicket({ userId, ticketId }) {
  const ticket = await Ticket.findOne({
    where: { id: ticketId, userId }
  });

  if (!ticket) {
    throw ApiError.notFound('Ticket not found');
  }

  if (ticket.status !== TICKET_STATUS.CLOSED) {
    await ticket.update({
      status: TICKET_STATUS.CLOSED,
      closedAt: new Date()
    });

    try {
      await notifyAdmins({
        permission: 'help:view',
        type: 'ticket_closed',
        title: 'Ticket Closed by User',
        body: `Ticket #${ticket.ticketNumber} was closed by the customer`,
        data: { ticketId: ticket.id, ticketNumber: ticket.ticketNumber }
      });
    } catch {
      // failure logged only
    }
  }

  return await Ticket.findByPk(ticket.id, {
    include: [{ model: TicketMessage, as: 'messages' }]
  });
};
