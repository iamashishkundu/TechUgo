const { z } = require('zod');

module.exports = {
  body: z.object({
    name: z.string().min(2, 'Role name must be at least 2 characters'),
    description: z.string().nullable().optional(),
    permissions: z.array(z.string()).optional(),
    permissionIds: z.array(z.string()).optional()
  })
};
