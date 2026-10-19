const { z } = require('zod');

module.exports = {
  body: z.object({
    sku: z.string().min(1, 'SKU is required'),
    attributes: z.record(z.any()).optional(),
    price: z.coerce.number().int().min(0).optional().nullable(),
    stock: z.coerce.number().int().min(0).optional(),
    lowStockThreshold: z.coerce.number().int().min(0).optional(),
    isActive: z.boolean().optional()
  })
};
