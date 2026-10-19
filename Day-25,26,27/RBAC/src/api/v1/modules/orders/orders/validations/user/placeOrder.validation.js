const { z } = require('zod');

module.exports = {
  body: z.object({
    addressId: z.string().uuid('Valid address ID is required')
  })
};
