const { models } = require('@db');

const { AuditLog } = models;

module.exports = async function listAuditLogs({ limit = 100 } = {}) {
  const cappedLimit = Math.min(Math.max(Number(limit) || 100, 1), 500);

  const logs = await AuditLog.findAll({
    order: [['createdAt', 'DESC']],
    limit: cappedLimit
  });

  return logs;
};
