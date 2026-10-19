const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const updateFaqCategoryService = require('../../services/updateFaqCategory.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await updateFaqCategoryService({
    categoryId: req.params.categoryId,
    ...req.body
  });
  return success(res, { message: 'FAQ category updated successfully', data });
});
