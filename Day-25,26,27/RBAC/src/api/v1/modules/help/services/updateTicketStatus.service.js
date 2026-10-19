const { models } = require('@db');
const ApiError = require('@utils/ApiError');
const { TICKET_STATUS, ALLOWED_TICKET_STAFF_TRANSITIONS } = require('@constants/ticketStatus');
const createNotification = require('@v1/modules/notifications/services/createNotification.service');

const { Ticket, TicketMessage } = models;

module.exports = async function updateTicketStatus({ ticketId, status: newStatus }) {
  const ticket = await Ticket.findByPk(ticketId);

  if (!ticket) {
    throw ApiError.notFound('Ticket not found');
  }

  const allowedNext = ALLOWED_TICKET_STAFF_TRANSITIONS[ticket.status] || [];
  if (!allowedNext.includes(newStatus)) {
    throw ApiError.conflict(
      `Cannot transition ticket from "${ticket.status}" to "${newStatus}"`
    );
  }

  const updates = { status: newStatus };
  if (newStatus === TICKET_STATUS.CLOSED) {
    updates.closedAt = new Date();
  }

  await ticket.update(updates);

  // Notify customer
  try {
    await createNotification({
      recipientType: 'user',
      recipientId: ticket.userId,
      type: 'ticket_status_updated',
      title: 'Ticket Status Updated',
      body: `Your ticket #${ticket.ticketNumber} status was changed to "${newStatus}"`,
      data: { ticketId: ticket.id, ticketNumber: ticket.ticketNumber, status: newStatus }
    });
  } catch {
    // failure logged only
  }

  return await Ticket.findByPk(ticket.id, {
    include: [{ model: TicketMessage, as: 'messages' }]
  });
};
