const { z } = require('zod');

module.exports = {
  body: z.object({
    twoFactorToken: z.string().min(1, 'twoFactorToken is required'),
    code: z.string().length(6, 'Verification code must be 6 digits')
  })
};
