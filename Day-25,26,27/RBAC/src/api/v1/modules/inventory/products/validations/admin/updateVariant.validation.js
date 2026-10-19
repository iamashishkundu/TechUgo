const { z } = require('zod');

module.exports = {
  body: z.object({
    sku: z.string().min(1).optional(),
    attributes: z.record(z.any()).optional(),
    price: z.coerce.number().int().min(0).optional().nullable(),
    lowStockThreshold: z.coerce.number().int().min(0).optional(),
    isActive: z.boolean().optional()
  })
};
