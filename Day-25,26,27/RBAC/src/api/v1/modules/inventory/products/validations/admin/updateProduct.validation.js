const { z } = require('zod');

module.exports = {
  body: z.object({
    categoryId: z.string().uuid('Valid category ID is required').optional(),
    name: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    description: z.string().optional(),
    basePrice: z.coerce.number().int().min(0).optional(),
    isActive: z.boolean().optional()
  })
};
