const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const getCartService = require('../../services/getCart.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await getCartService({ userId: req.auth.id });
  return success(res, { data });
});
