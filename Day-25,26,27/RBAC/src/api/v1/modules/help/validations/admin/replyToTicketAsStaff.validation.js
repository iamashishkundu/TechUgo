const { z } = require('zod');

module.exports = {
  body: z.object({
    message: z.string().min(1, 'Message is required')
  })
};
