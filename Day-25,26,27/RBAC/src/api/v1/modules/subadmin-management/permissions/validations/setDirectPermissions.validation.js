const { z } = require('zod');

module.exports = {
  params: z.object({
    subadminId: z.string().uuid('Invalid subadmin ID')
  }),
  body: z.object({
    allow: z.array(z.string()).optional(),
    deny: z.array(z.string()).optional(),
    permissions: z.array(
      z.object({
        permissionId: z.string().optional(),
        permission: z.string().optional(),
        effect: z.enum(['allow', 'deny'])
      })
    ).optional()
  })
};
