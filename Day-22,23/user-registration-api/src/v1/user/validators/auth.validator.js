const { z } = require('zod');
const fields = require('./fields');

const registerSchema = z
  .object({
    name: fields.name,
    email: fields.email,
    password: fields.password,
  })
  .strict();

// Login doesn't re-check the password policy, only that something reasonable was sent
const loginSchema = z
  .object({
    email: fields.email,
    password: z.string().min(1).max(72),
  })
  .strict();

module.exports = { registerSchema, loginSchema };
