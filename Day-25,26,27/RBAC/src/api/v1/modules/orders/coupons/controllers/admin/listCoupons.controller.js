const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listCouponsService = require('../../services/listCoupons.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listCouponsService(req.query);
  return success(res, { data });
});
