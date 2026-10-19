const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listFaqsService = require('../../services/listFaqs.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listFaqsService();
  return success(res, { data });
});
