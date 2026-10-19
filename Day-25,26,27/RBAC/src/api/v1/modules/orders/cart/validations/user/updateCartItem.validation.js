const { z } = require('zod');

module.exports = {
  body: z.object({
    quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1')
  })
};
