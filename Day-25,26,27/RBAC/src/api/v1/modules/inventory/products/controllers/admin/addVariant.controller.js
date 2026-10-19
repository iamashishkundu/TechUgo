const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const addVariantService = require('../../services/addVariant.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await addVariantService({
    productId: req.params.productId,
    ...req.body
  });
  return success(res, {
    statusCode: 201,
    message: 'Product variant added successfully',
    data
  });
});
