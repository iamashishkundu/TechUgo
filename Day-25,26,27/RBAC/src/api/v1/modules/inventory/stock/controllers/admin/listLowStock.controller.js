const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listLowStockService = require('../../services/listLowStock.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listLowStockService(req.query);
  return success(res, { data });
});
