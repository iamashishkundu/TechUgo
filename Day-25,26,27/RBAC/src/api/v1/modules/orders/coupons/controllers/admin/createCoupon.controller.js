const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const createCouponService = require('../../services/createCoupon.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await createCouponService(req.body);
  return success(res, {
    statusCode: 201,
    message: 'Coupon created successfully',
    data
  });
});
