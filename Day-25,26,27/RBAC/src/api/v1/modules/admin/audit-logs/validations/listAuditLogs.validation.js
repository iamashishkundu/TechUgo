const { z } = require('zod');

module.exports = {
  query: z.object({
    limit: z.coerce.number().min(1).max(500).optional()
  })
};
