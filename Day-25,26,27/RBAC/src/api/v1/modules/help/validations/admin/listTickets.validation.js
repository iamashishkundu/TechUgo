const { z } = require('zod');
const { TICKET_STATUS, TICKET_PRIORITY } = require('@constants/ticketStatus');

module.exports = {
  query: z.object({
    status: z.enum([
      TICKET_STATUS.OPEN,
      TICKET_STATUS.IN_PROGRESS,
      TICKET_STATUS.RESOLVED,
      TICKET_STATUS.CLOSED
    ]).optional(),
    priority: z.enum([
      TICKET_PRIORITY.LOW,
      TICKET_PRIORITY.MEDIUM,
      TICKET_PRIORITY.HIGH
    ]).optional(),
    userId: z.string().uuid().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).optional()
  })
};
