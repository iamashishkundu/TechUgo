const { z } = require('zod');

module.exports = {
  params: z.object({
    subadminId: z.string().uuid('Invalid subadmin ID')
  }),
  body: z.object({
    roleId: z.string().uuid('Invalid role ID').nullable()
  })
};
