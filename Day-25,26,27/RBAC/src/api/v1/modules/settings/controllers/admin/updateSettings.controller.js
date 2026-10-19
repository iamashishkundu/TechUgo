const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const updateSettingsService = require('../../services/updateSettings.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await updateSettingsService({
    settings: req.body.settings,
    updatedById: req.auth.id
  });
  return success(res, { message: 'Settings updated successfully', data });
});
