const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const forceLogoutSubadminService = require('../services/forceLogoutSubadmin.service');

module.exports = asyncHandler(async (req, res) => {
  await forceLogoutSubadminService({ subadminId: req.params.subadminId });
  return success(res, { message: 'Subadmin forced to log out from all sessions successfully' });
});
