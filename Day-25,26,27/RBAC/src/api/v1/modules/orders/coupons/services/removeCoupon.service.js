const { models } = require('@db');

const { Cart } = models;

module.exports = async function removeCoupon({ userId }) {
  const cart = await Cart.findOne({ where: { userId } });
  if (cart) {
    await cart.update({ couponCode: null });
  }

  return { success: true };
};
