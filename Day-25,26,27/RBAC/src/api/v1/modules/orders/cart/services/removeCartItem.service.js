const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Cart, CartItem } = models;

module.exports = async function removeCartItem({ userId, itemId }) {
  const cart = await Cart.findOne({ where: { userId } });
  if (!cart) {
    throw ApiError.notFound('Cart item not found');
  }

  const item = await CartItem.findOne({
    where: { id: itemId, cartId: cart.id }
  });

  if (!item) {
    throw ApiError.notFound('Cart item not found');
  }

  await item.destroy();

  return { success: true };
};
