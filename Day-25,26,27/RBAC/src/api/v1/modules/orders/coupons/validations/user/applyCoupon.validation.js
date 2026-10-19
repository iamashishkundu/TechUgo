const { z } = require('zod');

module.exports = {
  body: z.object({
    code: z.string().min(1, 'Coupon code is required')
  })
};
