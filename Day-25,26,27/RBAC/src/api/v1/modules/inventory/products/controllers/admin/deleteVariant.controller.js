const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const deleteVariantService = require('../../services/deleteVariant.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await deleteVariantService({
    productId: req.params.productId,
    variantId: req.params.variantId
  });
  return success(res, {
    message: 'Product variant deleted successfully',
    data
  });
});
