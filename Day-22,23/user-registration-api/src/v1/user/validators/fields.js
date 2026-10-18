const { z } = require('zod');

const name = z.string().trim().min(2).max(100);

// trim first, then lowercase, then check the format
const email = z.string().trim().toLowerCase().email().max(255);

// 72 is bcrypt's input limit; longer passwords are silently truncated
const password = z
  .string()
  .min(8)
  .max(72)
  .regex(/[A-Za-z]/, 'Password must contain a letter')
  .regex(/[0-9]/, 'Password must contain a number');

module.exports = { name, email, password };
