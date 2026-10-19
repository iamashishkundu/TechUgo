const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const unblockSubadminService = require('../services/unblockSubadmin.service');

module.exports = asyncHandler(async (req, res) => {
  await unblockSubadminService({ subadminId: req.params.subadminId });
  return success(res, { message: 'Subadmin unblocked successfully' });
});
