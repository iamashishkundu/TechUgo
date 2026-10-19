const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const getUserService = require('../services/getUser.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await getUserService({ userId: req.params.userId });
  return success(res, { data });
});
