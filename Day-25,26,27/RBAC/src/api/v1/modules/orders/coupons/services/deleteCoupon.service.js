const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Coupon } = models;

module.exports = async function deleteCoupon({ couponId }) {
  const coupon = await Coupon.findByPk(couponId);
  if (!coupon) {
    throw ApiError.notFound('Coupon not found');
  }

  await coupon.destroy();

  return { success: true };
};
