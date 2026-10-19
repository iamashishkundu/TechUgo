const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listActiveProductsService = require('../../services/listActiveProducts.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listActiveProductsService(req.query);
  return success(res, { data });
});
