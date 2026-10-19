const { z } = require('zod');

module.exports = {
  body: z.object({
    enabled: z.boolean()
  })
};
