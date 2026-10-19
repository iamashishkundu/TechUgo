const { z } = require('zod');

module.exports = {
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    body: z.string().min(1, 'Body is required'),
    audience: z.enum(['users', 'staff'])
  })
};
