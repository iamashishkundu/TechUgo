const { z } = require('zod');

module.exports = {
  body: z.object({
    settings: z.union([
      z.record(z.any()),
      z.array(
        z.object({
          key: z.string(),
          value: z.any()
        })
      )
    ])
  })
};
