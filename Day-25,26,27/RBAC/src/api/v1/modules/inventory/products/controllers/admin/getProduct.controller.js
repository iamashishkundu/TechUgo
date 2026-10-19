const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const getProductService = require('../../services/getProduct.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await getProductService({ productId: req.params.productId });
  return success(res, { data });
});
