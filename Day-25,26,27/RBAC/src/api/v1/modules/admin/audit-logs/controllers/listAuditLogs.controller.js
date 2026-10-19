const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const listAuditLogsService = require('../services/listAuditLogs.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await listAuditLogsService(req.query);
  return success(res, { data });
});
