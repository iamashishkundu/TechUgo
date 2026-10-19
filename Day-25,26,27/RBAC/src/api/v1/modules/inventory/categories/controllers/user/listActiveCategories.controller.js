const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listActiveCategoriesService = require('../../services/listActiveCategories.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listActiveCategoriesService();
  return success(res, { data });
});
