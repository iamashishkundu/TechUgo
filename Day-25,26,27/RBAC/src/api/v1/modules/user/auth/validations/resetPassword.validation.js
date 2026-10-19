const { z } = require('zod');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

module.exports = {
  body: z.object({
    token: z.string().min(1, 'Token is required'),
    newPassword: z.string().regex(
      passwordRegex,
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
    )
  })
};
