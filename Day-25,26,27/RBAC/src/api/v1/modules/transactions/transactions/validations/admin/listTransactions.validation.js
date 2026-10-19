const { z } = require('zod');

module.exports = {
  query: z.object({
    userId: z.string().uuid().optional(),
    type: z.enum(['wallet_topup', 'order_payment', 'refund', 'admin_adjustment']).optional(),
    direction: z.enum(['credit', 'debit']).optional(),
    status: z.enum(['success', 'failed']).optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).optional()
  })
};
