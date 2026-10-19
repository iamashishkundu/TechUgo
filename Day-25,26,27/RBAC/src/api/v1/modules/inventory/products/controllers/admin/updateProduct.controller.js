const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const updateProductService = require('../../services/updateProduct.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await updateProductService({
    productId: req.params.productId,
    ...req.body
  });
  return success(res, {
    message: 'Product updated successfully',
    data
  });
});
