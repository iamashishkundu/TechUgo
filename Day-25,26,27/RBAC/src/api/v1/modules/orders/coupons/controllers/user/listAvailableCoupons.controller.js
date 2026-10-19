const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listAvailableCouponsService = require('../../services/listAvailableCoupons.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listAvailableCouponsService();
  return success(res, { data });
});
