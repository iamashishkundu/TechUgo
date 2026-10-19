const { z } = require('zod');

module.exports = {
  body: z.object({
    variantId: z.string().uuid('Valid variant ID is required'),
    quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1')
  })
};
