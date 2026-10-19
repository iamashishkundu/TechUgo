const { z } = require('zod');

module.exports = {
  params: z.object({
    notificationId: z.string().uuid('Valid notification ID is required')
  })
};
