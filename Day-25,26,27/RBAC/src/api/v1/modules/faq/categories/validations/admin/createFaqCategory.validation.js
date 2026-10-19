const { z } = require('zod');

module.exports = {
  body: z.object({
    name: z.string().min(1, 'Category name is required'),
    sortOrder: z.coerce.number().optional(),
    isActive: z.boolean().optional()
  })
};
