const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const cancelOrderService = require('../../services/cancelOrder.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await cancelOrderService({
    userId: req.auth.id,
    orderId: req.params.orderId,
    reason: req.body.reason
  });
  return success(res, {
    message: 'Order cancelled and refunded successfully',
    data
  });
});
