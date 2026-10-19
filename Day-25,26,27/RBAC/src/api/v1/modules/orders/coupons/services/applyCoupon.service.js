const { models } = require('@db');
const ApiError = require('@utils/ApiError');
const getCartService = require('../../cart/services/getCart.service');
const validateCouponService = require('./validateCoupon.service');

const { Cart } = models;

module.exports = async function applyCoupon({ userId, code }) {
  const cartData = await getCartService({ userId });

  if (!cartData.items || cartData.items.length === 0) {
    throw ApiError.badRequest('Cannot apply coupon to an empty cart');
  }

  const { coupon, discount } = await validateCouponService({
    code,
    userId,
    subtotal: cartData.subtotal
  });

  const cart = await Cart.findOne({ where: { userId } });
  await cart.update({ couponCode: coupon.code });

  return {
    couponCode: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discount,
    subtotal: cartData.subtotal,
    total: cartData.subtotal - discount
  };
};
