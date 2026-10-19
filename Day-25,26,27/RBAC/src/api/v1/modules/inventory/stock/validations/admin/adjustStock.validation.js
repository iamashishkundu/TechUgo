const { z } = require('zod');

module.exports = {
  body: z.object({
    variantId: z.string().uuid('Valid variant ID is required'),
    quantityChange: z.coerce
      .number()
      .int('Quantity change must be an integer')
      .refine((val) => val !== 0, 'Quantity change must be non-zero'),
    note: z.string().min(1, 'Note is required')
  })
};
