const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Coupon } = models;

module.exports = async function createCoupon({
  code,
  description,
  discountType,
  discountValue,
  minOrderAmount = 0,
  maxDiscountAmount = null,
  usageLimit = null,
  perUserLimit = 1,
  startsAt,
  expiresAt,
  isActive = true
}) {
  const normalizedCode = code.toString().trim().toUpperCase();

  const existing = await Coupon.findOne({ where: { code: normalizedCode } });
  if (existing) {
    throw ApiError.conflict('Coupon code already exists');
  }

  const coupon = await Coupon.create({
    code: normalizedCode,
    description,
    discountType,
    discountValue,
    minOrderAmount: minOrderAmount || 0,
    maxDiscountAmount: maxDiscountAmount || null,
    usageLimit: usageLimit || null,
    perUserLimit: perUserLimit || 1,
    startsAt: new Date(startsAt),
    expiresAt: new Date(expiresAt),
    isActive: isActive !== false
  });

  return coupon;
};
