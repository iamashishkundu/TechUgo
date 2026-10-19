const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const getSubadminService = require('../services/getSubadmin.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await getSubadminService({ subadminId: req.params.subadminId });
  return success(res, { data });
});
