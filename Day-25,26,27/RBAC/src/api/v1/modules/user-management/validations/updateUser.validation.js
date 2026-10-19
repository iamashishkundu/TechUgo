const { z } = require('zod');

module.exports = {
  params: z.object({
    userId: z.string().uuid('Invalid user ID')
  }),
  body: z.object({
    fullName: z.string().min(2).optional(),
    phone: z.string().min(7).optional()
  })
};
