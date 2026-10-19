const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const reorderFaqsService = require('../../services/reorderFaqs.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await reorderFaqsService(req.body);
  return success(res, {
    message: 'FAQs reordered successfully',
    data
  });
});
