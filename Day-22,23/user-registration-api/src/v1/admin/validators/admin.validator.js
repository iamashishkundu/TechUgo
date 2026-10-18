const { z } = require('zod');
const fields = require('../../user/validators/fields');

// An admin may also change role
const adminUpdateUserSchema = z
  .object({
    name: fields.name.optional(),
    email: fields.email.optional(),
    password: fields.password.optional(),
    role: z.enum(['user', 'admin']).optional(),
  })
  .strict()
  .refine((obj) => Object.keys(obj).length > 0, {
    message: 'At least one field is required',
  });

module.exports = { adminUpdateUserSchema };
