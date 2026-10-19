const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const getCategoryService = require('../../services/getCategory.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await getCategoryService({ categoryId: req.params.categoryId });
  return success(res, { data });
});
