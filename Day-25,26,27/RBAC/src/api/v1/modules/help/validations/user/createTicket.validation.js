const { z } = require('zod');
const { TICKET_PRIORITY } = require('@constants/ticketStatus');

module.exports = {
  body: z.object({
    subject: z.string().min(1, 'Subject is required'),
    message: z.string().min(1, 'Message is required'),
    priority: z.enum([TICKET_PRIORITY.LOW, TICKET_PRIORITY.MEDIUM, TICKET_PRIORITY.HIGH]).optional()
  })
};
