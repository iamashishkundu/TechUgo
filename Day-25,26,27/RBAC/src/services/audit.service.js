const { models } = require('@db');
const logger = require('@config/logger');

const { AuditLog } = models;

function sanitize(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitize);
  }

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (
      lowerKey.includes('password') ||
      lowerKey.includes('token') ||
      lowerKey.includes('secret')
    ) {
      clean[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      clean[key] = sanitize(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

const auditService = {
  /**
   * Logs an action in the audit_logs table.
   */
  async log({
    actorType,
    actorId = null,
    actorName = null,
    module,
    action,
    entityType = null,
    entityId = null,
    before = null,
    after = null,
    ip = null,
    userAgent = null
  }) {
    try {
      await AuditLog.create({
        actorType,
        actorId,
        actorName,
        module,
        action,
        entityType,
        entityId,
        before: sanitize(before),
        after: sanitize(after),
        ip,
        userAgent
      });
    } catch (err) {
      logger.error('Failed to create audit log: %s', err.message);
    }
  }
};

module.exports = auditService;
