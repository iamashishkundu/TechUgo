const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const updateSubadminService = require('../services/updateSubadmin.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await updateSubadminService({
    subadminId: req.params.subadminId,
    ...req.body
  });
  return success(res, { message: 'Subadmin updated successfully', data });
});
