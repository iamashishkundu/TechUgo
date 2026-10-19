const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listProductsService = require('../../services/listProducts.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listProductsService(req.query);
  return success(res, { data });
});
