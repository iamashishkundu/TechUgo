const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const placeOrderService = require('../../services/placeOrder.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await placeOrderService({
    userId: req.auth.id,
    addressId: req.body.addressId
  });
  return success(res, {
    statusCode: 201,
    message: 'Order placed successfully',
    data
  });
});
