const { z } = require('zod');

module.exports = {
  body: z.object({
    type: z.enum(['credit', 'debit']),
    amount: z.coerce.number().int().min(1, 'Amount must be at least 1 minor unit'),
    note: z.string().min(1, 'Note is required')
  })
};
