const { z } = require('zod');

module.exports = {
  body: z.object({
    categoryId: z.string().uuid('Valid category ID is required'),
    name: z.string().min(1, 'Product name is required'),
    slug: z.string().min(1).optional(),
    description: z.string().optional(),
    basePrice: z.coerce.number().int().min(0, 'Base price must be a non-negative integer'),
    isActive: z.boolean().optional(),
    variants: z
      .array(
        z.object({
          sku: z.string().min(1, 'Variant SKU is required'),
          attributes: z.record(z.any()).optional(),
          price: z.coerce.number().int().min(0).optional().nullable(),
          stock: z.coerce.number().int().min(0).optional(),
          lowStockThreshold: z.coerce.number().int().min(0).optional()
        })
      )
      .optional()
  })
};
