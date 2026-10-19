const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const updateCouponService = require('../../services/updateCoupon.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await updateCouponService({
    couponId: req.params.couponId,
    ...req.body
  });
  return success(res, {
    message: 'Coupon updated successfully',
    data
  });
});
