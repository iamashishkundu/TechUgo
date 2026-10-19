const { z } = require('zod');

module.exports = {
  params: z.object({
    addressId: z.string().uuid('Invalid address ID')
  }),
  body: z.object({
    label: z.string().min(1).optional(),
    recipientName: z.string().min(1).optional(),
    phone: z.string().min(7).optional(),
    line1: z.string().min(1).optional(),
    line2: z.string().nullable().optional(),
    city: z.string().min(1).optional(),
    state: z.string().min(1).optional(),
    postalCode: z.string().min(1).optional(),
    country: z.string().min(1).optional(),
    isDefault: z.boolean().optional()
  })
};
