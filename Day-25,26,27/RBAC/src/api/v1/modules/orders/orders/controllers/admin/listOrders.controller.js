const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listOrdersService = require('../../services/listOrders.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listOrdersService(req.query);
  return success(res, { data });
});
