const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const createFaqService = require('../../services/createFaq.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await createFaqService(req.body);
  return success(res, {
    statusCode: 201,
    message: 'FAQ created successfully',
    data
  });
});
