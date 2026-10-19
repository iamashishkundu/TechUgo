const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Cart, CartItem, ProductVariant, Product } = models;

module.exports = async function addCartItem({ userId, variantId, quantity = 1 }) {
  const qty = Number(quantity);
  if (!qty || qty <= 0) {
    throw ApiError.badRequest('Quantity must be greater than 0');
  }

  const variant = await ProductVariant.findByPk(variantId, {
    include: [{ model: Product, as: 'product' }]
  });

  if (!variant || !variant.isActive || !variant.product || !variant.product.isActive) {
    throw ApiError.badRequest('Selected product variant is inactive or unavailable');
  }

  const [cart] = await Cart.findOrCreate({
    where: { userId },
    defaults: { userId }
  });

  let item = await CartItem.findOne({
    where: { cartId: cart.id, variantId }
  });

  if (item) {
    await item.update({ quantity: Number(item.quantity) + qty });
  } else {
    item = await CartItem.create({
      cartId: cart.id,
      variantId,
      quantity: qty
    });
  }

  return item;
};
