const { z } = require('zod');

module.exports = {
  body: z.object({
    code: z.string().min(1, 'Coupon code is required'),
    description: z.string().optional(),
    discountType: z.enum(['percent', 'fixed']),
    discountValue: z.coerce.number().int().min(1, 'Discount value must be at least 1'),
    minOrderAmount: z.coerce.number().int().min(0).optional(),
    maxDiscountAmount: z.coerce.number().int().min(1).optional().nullable(),
    usageLimit: z.coerce.number().int().min(1).optional().nullable(),
    perUserLimit: z.coerce.number().int().min(1).optional(),
    startsAt: z.string().datetime({ offset: true }).or(z.string().min(1)),
    expiresAt: z.string().datetime({ offset: true }).or(z.string().min(1)),
    isActive: z.boolean().optional()
  })
};
