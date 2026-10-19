const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const updateLowStockThresholdService = require('../../services/updateLowStockThreshold.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await updateLowStockThresholdService({
    variantId: req.params.variantId,
    lowStockThreshold: req.body.lowStockThreshold
  });
  return success(res, {
    message: 'Low stock threshold updated successfully',
    data
  });
});
