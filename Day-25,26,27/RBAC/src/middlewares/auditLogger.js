const auditService = require('@services/audit.service');

/**
 * Audit logger middleware.
 * Attaches a listener to res.on('finish') to record an audit log on success (< 400).
 * @param {Object} options
 * @param {string} options.module - Module name (e.g. 'orders')
 * @param {string} options.action - Action name (e.g. 'update')
 * @param {string} [options.entityType] - Type of entity affected
 */
function auditLogger({ module: moduleName, action, entityType = null }) {
  return (req, res, next) => {
    res.locals.audit = res.locals.audit || {};

    res.on('finish', () => {
      if (res.statusCode < 400) {
        const auditData = res.locals.audit || {};
        const actor = req.actor;
        const auth = req.auth || {};

        auditService.log({
          actorType: auth.actorType || (req.body && req.body.email ? 'anonymous' : 'system'),
          actorId: auth.id || null,
          actorName: actor ? actor.fullName : null,
          module: moduleName,
          action,
          entityType: auditData.entityType || entityType,
          entityId: auditData.entityId || req.params.id || null,
          before: auditData.before || null,
          after: auditData.after || null,
          ip: req.ip || req.headers['x-forwarded-for'] || null,
          userAgent: req.headers['user-agent'] || null
        });
      }
    });

    next();
  };
}

module.exports = auditLogger;
