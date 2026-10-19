const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listModulesAndActionsService = require('../services/listModulesAndActions.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listModulesAndActionsService();
  return success(res, { data });
});
