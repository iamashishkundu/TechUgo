const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const getAuditLogService = require('../services/getAuditLog.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await getAuditLogService({ auditLogId: req.params.auditLogId });
  return success(res, { data });
});
