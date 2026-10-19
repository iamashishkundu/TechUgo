const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const toggleFaqStatusService = require('../../services/toggleFaqStatus.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await toggleFaqStatusService({ faqId: req.params.faqId });
  return success(res, {
    message: 'FAQ status updated successfully',
    data
  });
});
