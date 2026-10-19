const { z } = require('zod');

module.exports = {
  body: z.object({
    items: z.array(
      z.object({
        id: z.string().uuid('Invalid FAQ ID'),
        sortOrder: z.coerce.number()
      })
    ).min(1, 'items array must have at least one element')
  })
};
