const { z } = require('zod');

module.exports = {
  body: z.object({
    lowStockThreshold: z.coerce.number().int().min(0, 'Threshold must be a non-negative integer')
  })
};
