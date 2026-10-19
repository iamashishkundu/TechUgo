const { z } = require('zod');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

module.exports = {
  body: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Valid email is required'),
    phone: z.string().min(7, 'Phone number must be at least 7 characters'),
    password: z.string().regex(
      passwordRegex,
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
    )
  })
};
