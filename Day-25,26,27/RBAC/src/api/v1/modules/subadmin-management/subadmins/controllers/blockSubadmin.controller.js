const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const blockSubadminService = require('../services/blockSubadmin.service');

module.exports = asyncHandler(async (req, res) => {
  await blockSubadminService({ subadminId: req.params.subadminId });
  return success(res, { message: 'Subadmin blocked successfully' });
});
