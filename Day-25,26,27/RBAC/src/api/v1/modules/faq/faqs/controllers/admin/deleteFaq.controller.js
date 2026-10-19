const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const deleteFaqService = require('../../services/deleteFaq.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await deleteFaqService({ faqId: req.params.faqId });
  return success(res, {
    message: 'FAQ deleted successfully',
    data
  });
});
