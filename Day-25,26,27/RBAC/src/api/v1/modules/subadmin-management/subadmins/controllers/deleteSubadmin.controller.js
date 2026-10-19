const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const deleteSubadminService = require('../services/deleteSubadmin.service');

module.exports = asyncHandler(async (req, res) => {
  await deleteSubadminService({ subadminId: req.params.subadminId });
  return success(res, { message: 'Subadmin deleted successfully' });
});
