const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listCategoriesService = require('../../services/listCategories.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listCategoriesService();
  return success(res, { data });
});
