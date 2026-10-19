const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const removeCouponService = require('../../services/removeCoupon.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await removeCouponService({ userId: req.auth.id });
  return success(res, {
    message: 'Coupon removed successfully',
    data
  });
});
