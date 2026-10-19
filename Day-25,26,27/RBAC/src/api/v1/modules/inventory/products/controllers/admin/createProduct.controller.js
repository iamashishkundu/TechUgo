const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const createProductService = require('../../services/createProduct.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await createProductService(req.body);
  return success(res, {
    statusCode: 201,
    message: 'Product created successfully',
    data
  });
});
