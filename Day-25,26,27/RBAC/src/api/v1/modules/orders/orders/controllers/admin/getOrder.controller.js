const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const getOrderService = require('../../services/getOrder.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await getOrderService({ orderId: req.params.orderId });
  return success(res, { data });
});
