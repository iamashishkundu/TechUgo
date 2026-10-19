const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const updateCategoryService = require('../../services/updateCategory.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await updateCategoryService({
    categoryId: req.params.categoryId,
    ...req.body
  });
  return success(res, {
    message: 'Category updated successfully',
    data
  });
});
