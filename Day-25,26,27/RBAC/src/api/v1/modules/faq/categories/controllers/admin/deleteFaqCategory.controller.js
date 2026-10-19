const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const deleteFaqCategoryService = require('../../services/deleteFaqCategory.service');

module.exports = asyncHandler(async (req, res) => {
  await deleteFaqCategoryService({ categoryId: req.params.categoryId });
  return success(res, { message: 'FAQ category deleted successfully' });
});
