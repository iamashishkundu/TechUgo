const { z } = require('zod');

module.exports = {
  body: z.object({
    amount: z.coerce
      .number()
      .int('Amount must be an integer')
      .min(1, 'Amount must be at least 1')
      .max(10000000, 'Amount cannot exceed 10,000,000')
  })
};
