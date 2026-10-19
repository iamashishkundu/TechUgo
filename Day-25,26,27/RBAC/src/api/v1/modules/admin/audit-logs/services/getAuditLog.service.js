const { models } = require('@db');
const ApiError = require('@utils/ApiError');

const { AuditLog } = models;

module.exports = async function getAuditLog({ auditLogId }) {
  const log = await AuditLog.findByPk(auditLogId);
  if (!log) {
    throw ApiError.notFound('Audit log not found');
  }
  return log;
};
