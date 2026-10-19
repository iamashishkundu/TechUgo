const { z } = require('zod');

module.exports = {
  body: z.object({
    name: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    parentId: z.string().uuid('Valid parent category ID is required').optional().nullable(),
    isActive: z.boolean().optional()
  })
};
