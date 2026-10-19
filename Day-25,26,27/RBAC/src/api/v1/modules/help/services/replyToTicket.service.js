const { sequelize, models } = require('@db');
const ApiError = require('@utils/ApiError');
const { TICKET_STATUS } = require('@constants/ticketStatus');
const notifyAdmins = require('@v1/modules/notifications/services/notifyAdmins.service');

const { Ticket, TicketMessage } = models;

module.exports = async function replyToTicket({
  userId,
  ticketId,
  message,
  files = []
}) {
  const ticket = await Ticket.findOne({
    where: { id: ticketId, userId }
  });

  if (!ticket) {
    throw ApiError.notFound('Ticket not found');
  }

  if (ticket.status === TICKET_STATUS.CLOSED) {
    throw ApiError.conflict('Cannot reply to a closed ticket');
  }

  const attachmentUrls = Array.isArray(files)
    ? files.map((f) => `/uploads/tickets/${f.filename}`)
    : [];

  await sequelize.transaction(async (t) => {
    await TicketMessage.create(
      {
        ticketId: ticket.id,
        senderType: 'user',
        senderId: userId,
        message,
        attachments: attachmentUrls
      },
      { transaction: t }
    );

    const updates = { lastMessageAt: new Date() };
    if (ticket.status === TICKET_STATUS.RESOLVED) {
      updates.status = TICKET_STATUS.OPEN;
    }

    await ticket.update(updates, { transaction: t });
  });

  // Notify staff
  try {
    await notifyAdmins({
      permission: 'help:view',
      type: 'ticket_reply',
      title: 'Customer Replied to Ticket',
      body: `New reply on ticket #${ticket.ticketNumber}`,
      data: { ticketId: ticket.id, ticketNumber: ticket.ticketNumber }
    });
  } catch {
    // failure logged only
  }

  return await Ticket.findByPk(ticket.id, {
    include: [{ model: TicketMessage, as: 'messages' }]
  });
};
