const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const getSettingsService = require('../../services/getSettings.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await getSettingsService();
  return success(res, { data });
});
