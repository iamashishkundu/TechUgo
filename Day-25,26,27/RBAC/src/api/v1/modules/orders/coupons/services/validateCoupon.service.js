const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Coupon, CouponUsage } = models;

module.exports = async function validateCoupon({
  code,
  userId,
  subtotal,
  lock = false,
  transaction
}) {
  if (!code) {
    throw ApiError.badRequest('Coupon code is required');
  }

  const normalizedCode = code.toString().trim().toUpperCase();

  const options = {
    where: { code: normalizedCode },
    transaction
  };

  if (lock && transaction) {
    options.lock = transaction.LOCK.UPDATE;
  }

  const coupon = await Coupon.findOne(options);

  if (!coupon || !coupon.isActive) {
    throw ApiError.badRequest('Invalid or inactive coupon code');
  }

  const now = new Date();
  if (now < new Date(coupon.startsAt)) {
    throw ApiError.badRequest('Coupon is not yet active');
  }

  if (now > new Date(coupon.expiresAt)) {
    throw ApiError.badRequest('Coupon has expired');
  }

  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    throw ApiError.badRequest('Coupon usage limit reached');
  }

  if (userId) {
    const userUsageCount = await CouponUsage.count({
      where: {
        couponId: coupon.id,
        userId
      },
      transaction
    });

    if (userUsageCount >= coupon.perUserLimit) {
      throw ApiError.badRequest('You have reached the usage limit for this coupon');
    }
  }

  const orderSubtotal = Number(subtotal) || 0;
  if (orderSubtotal < Number(coupon.minOrderAmount)) {
    throw ApiError.badRequest(
      `Minimum order amount for this coupon is ${coupon.minOrderAmount} minor units`
    );
  }

  let discount = 0;
  if (coupon.discountType === 'percent') {
    discount = Math.floor((orderSubtotal * Number(coupon.discountValue)) / 100);
    if (coupon.maxDiscountAmount !== null && coupon.maxDiscountAmount !== undefined) {
      discount = Math.min(discount, Number(coupon.maxDiscountAmount));
    }
  } else if (coupon.discountType === 'fixed') {
    discount = Math.min(Number(coupon.discountValue), orderSubtotal);
  }

  return {
    coupon,
    discount
  };
};
