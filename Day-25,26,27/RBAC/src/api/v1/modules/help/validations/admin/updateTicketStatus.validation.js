const { z } = require('zod');
const { TICKET_STATUS } = require('@constants/ticketStatus');

module.exports = {
  body: z.object({
    status: z.enum([
      TICKET_STATUS.OPEN,
      TICKET_STATUS.IN_PROGRESS,
      TICKET_STATUS.RESOLVED,
      TICKET_STATUS.CLOSED
    ])
  })
};
