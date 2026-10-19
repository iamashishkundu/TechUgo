const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const addCartItemService = require('../../services/addCartItem.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await addCartItemService({
    userId: req.auth.id,
    variantId: req.body.variantId,
    quantity: req.body.quantity
  });
  return success(res, {
    statusCode: 201,
    message: 'Item added to cart',
    data
  });
});
