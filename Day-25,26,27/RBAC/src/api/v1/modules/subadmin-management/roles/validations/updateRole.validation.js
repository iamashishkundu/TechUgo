const { z } = require('zod');

module.exports = {
  params: z.object({
    roleId: z.string().uuid('Invalid role ID')
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().nullable().optional(),
    permissions: z.array(z.string()).optional(),
    permissionIds: z.array(z.string()).optional()
  })
};
