const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const deleteCouponService = require('../../services/deleteCoupon.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await deleteCouponService({ couponId: req.params.couponId });
  return success(res, {
    message: 'Coupon deleted successfully',
    data
  });
});
