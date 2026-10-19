const { z } = require('zod');

module.exports = {
  body: z.object({
    categoryId: z.string().uuid('Valid category ID is required'),
    question: z.string().min(1, 'Question is required'),
    answer: z.string().min(1, 'Answer is required'),
    sortOrder: z.coerce.number().optional(),
    isActive: z.boolean().optional()
  })
};
