const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const updateFaqService = require('../../services/updateFaq.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await updateFaqService({
    faqId: req.params.faqId,
    ...req.body
  });
  return success(res, {
    message: 'FAQ updated successfully',
    data
  });
});
