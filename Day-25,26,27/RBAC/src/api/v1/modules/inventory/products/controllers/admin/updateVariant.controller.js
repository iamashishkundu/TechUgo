const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const updateVariantService = require('../../services/updateVariant.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await updateVariantService({
    productId: req.params.productId,
    variantId: req.params.variantId,
    ...req.body
  });
  return success(res, {
    message: 'Product variant updated successfully',
    data
  });
});
