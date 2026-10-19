const { sequelize, models } = require('@db');
const { generateTicketNumber } = require('@utils/orderNumber');
const { TICKET_STATUS, TICKET_PRIORITY } = require('@constants/ticketStatus');
const notifyAdmins = require('@v1/modules/notifications/services/notifyAdmins.service');

const { Ticket, TicketMessage } = models;

module.exports = async function createTicket({
  userId,
  subject,
  message,
  priority = TICKET_PRIORITY.MEDIUM,
  files = []
}) {
  const ticketNumber = generateTicketNumber();
  const attachmentUrls = Array.isArray(files)
    ? files.map((f) => `/uploads/tickets/${f.filename}`)
    : [];

  const ticket = await sequelize.transaction(async (t) => {
    const newTicket = await Ticket.create(
      {
        ticketNumber,
        userId,
        subject,
        status: TICKET_STATUS.OPEN,
        priority: priority || TICKET_PRIORITY.MEDIUM,
        lastMessageAt: new Date()
      },
      { transaction: t }
    );

    await TicketMessage.create(
      {
        ticketId: newTicket.id,
        senderType: 'user',
        senderId: userId,
        message,
        attachments: attachmentUrls
      },
      { transaction: t }
    );

    return newTicket;
  });

  // Notify staff
  try {
    await notifyAdmins({
      permission: 'help:view',
      type: 'ticket_created',
      title: 'New Support Ticket',
      body: `Ticket #${ticket.ticketNumber}: "${subject}"`,
      data: { ticketId: ticket.id, ticketNumber: ticket.ticketNumber }
    });
  } catch {
    // failure logged only
  }

  return await Ticket.findByPk(ticket.id, {
    include: [{ model: TicketMessage, as: 'messages' }]
  });
};
