const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const toggleMaintenanceModeService = require('../../services/toggleMaintenanceMode.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await toggleMaintenanceModeService({
    enabled: req.body.enabled,
    updatedById: req.auth.id
  });
  return success(res, {
    message: `Maintenance mode ${req.body.enabled ? 'enabled' : 'disabled'} successfully`,
    data
  });
});
