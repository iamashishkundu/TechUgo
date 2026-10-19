const { z } = require('zod');

module.exports = {
  body: z.object({
    label: z.string().min(1, 'Label is required'),
    recipientName: z.string().min(1, 'Recipient name is required'),
    phone: z.string().min(7, 'Phone number must be at least 7 characters'),
    line1: z.string().min(1, 'Address line 1 is required'),
    line2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
    isDefault: z.boolean().optional()
  })
};
