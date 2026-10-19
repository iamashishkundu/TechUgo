const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listFaqCategoriesService = require('../../services/listFaqCategories.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listFaqCategoriesService();
  return success(res, { data });
});
