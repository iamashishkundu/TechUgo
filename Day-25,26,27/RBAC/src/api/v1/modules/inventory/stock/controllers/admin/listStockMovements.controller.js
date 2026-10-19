const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listStockMovementsService = require('../../services/listStockMovements.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listStockMovementsService(req.query);
  return success(res, { data });
});
