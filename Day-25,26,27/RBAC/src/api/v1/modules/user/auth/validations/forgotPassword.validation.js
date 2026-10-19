const { z } = require('zod');

module.exports = {
  body: z.object({
    email: z.string().email('Valid email is required')
  })
};
