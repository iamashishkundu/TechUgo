const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const getCouponService = require('../../services/getCoupon.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await getCouponService({ couponId: req.params.couponId });
  return success(res, { data });
});
