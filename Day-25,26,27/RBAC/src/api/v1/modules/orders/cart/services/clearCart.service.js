const { models } = require('@db');

const { Cart, CartItem } = models;

module.exports = async function clearCart({ userId, transaction } = {}) {
  const cart = await Cart.findOne({
    where: { userId },
    transaction
  });

  if (!cart) {
    return { success: true };
  }

  await CartItem.destroy({
    where: { cartId: cart.id },
    transaction
  });

  await cart.update({ couponCode: null }, { transaction });

  return { success: true };
};
