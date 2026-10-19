const { z } = require('zod');

module.exports = {
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required')
  })
};
