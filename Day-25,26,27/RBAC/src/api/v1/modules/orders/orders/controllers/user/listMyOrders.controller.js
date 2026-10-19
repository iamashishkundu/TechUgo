const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listMyOrdersService = require('../../services/listMyOrders.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listMyOrdersService({
    userId: req.auth.id,
    page: req.query.page,
    limit: req.query.limit
  });
  return success(res, { data });
});
