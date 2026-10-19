const { z } = require('zod');

module.exports = {
  body: z.object({
    password: z.string().min(1, 'Password is required'),
    code: z.string().length(6, 'Verification code must be 6 digits')
  })
};
