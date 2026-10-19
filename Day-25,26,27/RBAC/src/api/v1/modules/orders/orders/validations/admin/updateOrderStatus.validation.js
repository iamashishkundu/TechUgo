const { z } = require('zod');
const { ORDER_STATUS } = require('@constants/orderStatus');

module.exports = {
  body: z.object({
    status: z.enum([
      ORDER_STATUS.CONFIRMED,
      ORDER_STATUS.SHIPPED,
      ORDER_STATUS.DELIVERED,
      ORDER_STATUS.CANCELLED,
      ORDER_STATUS.RETURNED,
      ORDER_STATUS.REFUNDED
    ]),
    note: z.string().optional()
  })
};
