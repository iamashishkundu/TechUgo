const { z } = require('zod');

module.exports = {
  query: z.object({
    userId: z.string().uuid().optional(),
    orderId: z.string().uuid().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).optional()
  })
};
