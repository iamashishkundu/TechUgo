const { z } = require('zod');

module.exports = {
  body: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
    phone: z.string().min(7, 'Phone number must be at least 7 characters').optional()
  })
};
