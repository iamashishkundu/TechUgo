const { z } = require('zod');

module.exports = {
  params: z.object({
    faqId: z.string().uuid('Invalid FAQ ID')
  }),
  body: z.object({
    categoryId: z.string().uuid().optional(),
    question: z.string().min(1).optional(),
    answer: z.string().min(1).optional(),
    sortOrder: z.coerce.number().optional(),
    isActive: z.boolean().optional()
  })
};
