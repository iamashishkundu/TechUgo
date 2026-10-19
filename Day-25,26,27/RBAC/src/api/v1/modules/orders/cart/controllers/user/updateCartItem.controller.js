const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const updateCartItemService = require('../../services/updateCartItem.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await updateCartItemService({
    userId: req.auth.id,
    itemId: req.params.itemId,
    quantity: req.body.quantity
  });
  return success(res, {
    message: 'Cart item updated',
    data
  });
});
