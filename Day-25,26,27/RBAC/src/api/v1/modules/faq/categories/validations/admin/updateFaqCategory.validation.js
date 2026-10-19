const { z } = require('zod');

module.exports = {
  params: z.object({
    categoryId: z.string().uuid('Invalid category ID')
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    sortOrder: z.coerce.number().optional(),
    isActive: z.boolean().optional()
  })
};
