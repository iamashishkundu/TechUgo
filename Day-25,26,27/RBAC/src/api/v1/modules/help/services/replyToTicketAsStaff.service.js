const { sequelize, models } = require('@db');
const ApiError = require('@utils/ApiError');
const { TICKET_STATUS } = require('@constants/ticketStatus');
const createNotification = require('@v1/modules/notifications/services/createNotification.service');

const { Ticket, TicketMessage } = models;

module.exports = async function replyToTicketAsStaff({
  adminId,
  ticketId,
  message,
  files = []
}) {
  const ticket = await Ticket.findByPk(ticketId);

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
        senderType: 'admin',
        senderId: adminId,
        message,
        attachments: attachmentUrls
      },
      { transaction: t }
    );

    const updates = { lastMessageAt: new Date() };
    if (ticket.status === TICKET_STATUS.OPEN) {
      updates.status = TICKET_STATUS.IN_PROGRESS;
    }

    await ticket.update(updates, { transaction: t });
  });

  // Notify customer
  try {
    await createNotification({
      recipientType: 'user',
      recipientId: ticket.userId,
      type: 'ticket_reply',
      title: 'Staff Replied to Ticket',
      body: `A support agent has replied to your ticket #${ticket.ticketNumber}`,
      data: { ticketId: ticket.id, ticketNumber: ticket.ticketNumber }
    });
  } catch {
    // failure logged only
  }

  return await Ticket.findByPk(ticket.id, {
    include: [{ model: TicketMessage, as: 'messages' }]
  });
};
