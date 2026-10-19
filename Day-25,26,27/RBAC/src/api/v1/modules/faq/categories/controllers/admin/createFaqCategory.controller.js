const asyncHandler = require('@utils/asyncHandler');
const { created } = require('@utils/apiResponse');
const createFaqCategoryService = require('../../services/createFaqCategory.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await createFaqCategoryService(req.body);
  return created(res, { message: 'FAQ category created successfully', data });
});
