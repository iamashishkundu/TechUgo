const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const deleteCategoryService = require('../../services/deleteCategory.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await deleteCategoryService({ categoryId: req.params.categoryId });
  return success(res, {
    message: 'Category deleted successfully',
    data
  });
});
