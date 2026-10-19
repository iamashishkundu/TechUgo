const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const getMyOrderService = require('../../services/getMyOrder.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await getMyOrderService({
    userId: req.auth.id,
    orderId: req.params.orderId
  });
  return success(res, { data });
});
