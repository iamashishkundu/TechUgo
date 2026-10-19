const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Coupon } = models;

module.exports = async function getCoupon({ couponId }) {
  const coupon = await Coupon.findByPk(couponId);
  if (!coupon) {
    throw ApiError.notFound('Coupon not found');
  }

  return coupon;
};
