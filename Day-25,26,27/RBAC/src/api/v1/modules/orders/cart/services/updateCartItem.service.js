const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Cart, CartItem } = models;

module.exports = async function updateCartItem({ userId, itemId, quantity }) {
  const qty = Number(quantity);
  if (!qty || qty <= 0) {
    throw ApiError.badRequest('Quantity must be greater than 0');
  }

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

  await item.update({ quantity: qty });

  return item;
};
