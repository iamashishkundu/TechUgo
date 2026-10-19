const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const removeCartItemService = require('../../services/removeCartItem.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await removeCartItemService({
    userId: req.auth.id,
    itemId: req.params.itemId
  });
  return success(res, {
    message: 'Cart item removed',
    data
  });
});
