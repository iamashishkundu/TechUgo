const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const getPublicSettingsService = require('../../services/getPublicSettings.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await getPublicSettingsService();
  return success(res, { data });
});
