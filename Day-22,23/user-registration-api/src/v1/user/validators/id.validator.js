const { z } = require('zod');

// Digits only: rejects "abc", "-1", "5.5", and "1e3" before converting to a number
const idParamSchema = z
  .object({
    id: z
      .string()
      .regex(/^\d+$/, 'id must be a positive integer')
      .transform(Number)
      .pipe(z.number().int().positive().max(4294967295)), // INT UNSIGNED max
  })
  .strict();

module.exports = { idParamSchema };
