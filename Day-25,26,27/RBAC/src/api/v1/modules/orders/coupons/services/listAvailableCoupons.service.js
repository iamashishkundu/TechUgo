const { Op } = require('sequelize');
const { sequelize, models } = require('@db');

const { Coupon } = models;

module.exports = async function listAvailableCoupons() {
  const now = new Date();

  const coupons = await Coupon.findAll({
    where: {
      isActive: true,
      startsAt: { [Op.lte]: now },
      expiresAt: { [Op.gte]: now },
      [Op.or]: [
        { usageLimit: null },
        { usedCount: { [Op.lt]: sequelize.col('usage_limit') } }
      ]
    },
    attributes: [
      'id',
      'code',
      'description',
      'discountType',
      'discountValue',
      'minOrderAmount',
      'maxDiscountAmount',
      'startsAt',
      'expiresAt'
    ],
    order: [['createdAt', 'DESC']]
  });

  return coupons;
};
