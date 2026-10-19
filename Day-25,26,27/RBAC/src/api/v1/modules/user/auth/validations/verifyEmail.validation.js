const { z } = require('zod');

module.exports = {
  body: z.object({
    token: z.string().min(1, 'Verification token is required')
  })
};
