const { z } = require('zod');

module.exports = {
  params: z.object({
    subadminId: z.string().uuid('Invalid subadmin ID')
  })
};
