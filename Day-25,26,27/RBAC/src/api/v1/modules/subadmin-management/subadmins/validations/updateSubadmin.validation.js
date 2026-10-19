const { z } = require('zod');

module.exports = {
  params: z.object({
    subadminId: z.string().uuid('Invalid subadmin ID')
  }),
  body: z.object({
    fullName: z.string().min(2).optional(),
    phone: z.string().min(7).optional(),
    roleId: z.string().uuid().nullable().optional()
  })
};
