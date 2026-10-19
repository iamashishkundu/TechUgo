const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const adjustStockService = require('../../services/adjustStock.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await adjustStockService({
    ...req.body,
    actorType: req.auth.actorType,
    actorId: req.auth.id
  });
  return success(res, {
    message: 'Stock adjusted successfully',
    data
  });
});
