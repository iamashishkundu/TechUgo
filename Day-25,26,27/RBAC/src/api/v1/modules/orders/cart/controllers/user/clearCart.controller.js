const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const clearCartService = require('../../services/clearCart.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await clearCartService({ userId: req.auth.id });
  return success(res, {
    message: 'Cart cleared',
    data
  });
});
