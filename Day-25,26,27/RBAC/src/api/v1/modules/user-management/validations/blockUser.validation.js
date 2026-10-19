const { z } = require('zod');

module.exports = {
  params: z.object({
    userId: z.string().uuid('Invalid user ID')
  })
};
