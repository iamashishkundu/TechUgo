const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const deleteProductService = require('../../services/deleteProduct.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await deleteProductService({ productId: req.params.productId });
  return success(res, {
    message: 'Product deleted successfully',
    data
  });
});
