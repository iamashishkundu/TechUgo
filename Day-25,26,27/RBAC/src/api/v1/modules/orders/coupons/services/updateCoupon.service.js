const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { Coupon } = models;

module.exports = async function updateCoupon({
  couponId,
  code,
  description,
  discountType,
  discountValue,
  minOrderAmount,
  maxDiscountAmount,
  usageLimit,
  perUserLimit,
  startsAt,
  expiresAt,
  isActive
}) {
  const coupon = await Coupon.findByPk(couponId);
  if (!coupon) {
    throw ApiError.notFound('Coupon not found');
  }

  const updates = {};
  if (code !== undefined) {
    const normalizedCode = code.toString().trim().toUpperCase();
    if (normalizedCode !== coupon.code) {
      const existing = await Coupon.findOne({ where: { code: normalizedCode } });
      if (existing) {
        throw ApiError.conflict('Coupon code already exists');
      }
    }
    updates.code = normalizedCode;
  }
  if (description !== undefined) updates.description = description;
  if (discountType !== undefined) updates.discountType = discountType;
  if (discountValue !== undefined) updates.discountValue = discountValue;
  if (minOrderAmount !== undefined) updates.minOrderAmount = minOrderAmount;
  if (maxDiscountAmount !== undefined) updates.maxDiscountAmount = maxDiscountAmount;
  if (usageLimit !== undefined) updates.usageLimit = usageLimit;
  if (perUserLimit !== undefined) updates.perUserLimit = perUserLimit;
  if (startsAt !== undefined) updates.startsAt = new Date(startsAt);
  if (expiresAt !== undefined) updates.expiresAt = new Date(expiresAt);
  if (isActive !== undefined) updates.isActive = isActive;

  await coupon.update(updates);

  return coupon;
};
