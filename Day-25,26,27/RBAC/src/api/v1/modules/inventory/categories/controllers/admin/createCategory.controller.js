const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const createCategoryService = require('../../services/createCategory.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await createCategoryService(req.body);
  return success(res, {
    statusCode: 201,
    message: 'Category created successfully',
    data
  });
});
