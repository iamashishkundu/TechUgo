const { z } = require('zod');
const fields = require('./fields');

// A normal user: no role field allowed at all
const updateProfileSchema = z
  .object({
    name: fields.name.optional(),
    email: fields.email.optional(),
    password: fields.password.optional(),
  })
  .strict()
  .refine((obj) => Object.keys(obj).length > 0, {
    message: 'At least one field is required',
  });

module.exports = { updateProfileSchema };
