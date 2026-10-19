const { z } = require('zod');

module.exports = {
  body: z.object({
    ids: z.array(z.string().uuid()).min(1).max(100),
    action: z.enum(['block', 'unblock', 'delete'])
  })
};
