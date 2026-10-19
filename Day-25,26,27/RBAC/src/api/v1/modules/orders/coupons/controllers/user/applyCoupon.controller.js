const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const applyCouponService = require('../../services/applyCoupon.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await applyCouponService({
    userId: req.auth.id,
    code: req.body.code
  });
  return success(res, {
    message: 'Coupon applied successfully',
    data
  });
});
