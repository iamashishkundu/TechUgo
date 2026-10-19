const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const getActiveProductService = require('../../services/getActiveProduct.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await getActiveProductService({ productId: req.params.productId });
  return success(res, { data });
});
