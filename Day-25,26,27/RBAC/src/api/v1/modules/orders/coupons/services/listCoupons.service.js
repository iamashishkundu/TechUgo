const { models } = require('@db');

const { Coupon } = models;

module.exports = async function listCoupons({ page = 1, limit = 20 } = {}) {
  const offset = (Number(page) - 1) * Number(limit);

  const { rows, count } = await Coupon.findAndCountAll({
    order: [['createdAt', 'DESC']],
    limit: Number(limit),
    offset
  });

  return {
    coupons: rows,
    pagination: {
      total: count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(count / Number(limit))
    }
  };
};
