const { sequelize, models } = require('@db');
const sessionService = require('@services/auth/session.service');
const auditService = require('@services/audit.service');

const { Admin } = models;

module.exports = async function bulkAction({ ids, action, adminUser, ip, userAgent }) {
  const results = [];

  await sequelize.transaction(async (t) => {
    for (const id of ids) {
      try {
        const subadmin = await Admin.findOne({
          where: { id, type: 'subadmin' },
          transaction: t
        });

        if (!subadmin) {
          results.push({ id, success: false, reason: 'Subadmin not found' });
          continue;
        }

        const before = subadmin.toJSON();

        if (action === 'block') {
          await subadmin.update({ status: 'blocked' }, { transaction: t });
          await sessionService.revokeAllForActor('subadmin', id, { transaction: t });
        } else if (action === 'unblock') {
          await subadmin.update({ status: 'active' }, { transaction: t });
        } else if (action === 'delete') {
          await subadmin.destroy({ transaction: t });
          await sessionService.revokeAllForActor('subadmin', id, { transaction: t });
        }

        const after = subadmin.toJSON();

        // Audit log per affected subadmin
        auditService.log({
          actorType: 'admin',
          actorId: adminUser ? adminUser.id : null,
          actorName: adminUser ? adminUser.fullName : null,
          module: 'subadmin_management',
          action: `bulk_${action}`,
          entityType: 'subadmin',
          entityId: id,
          before,
          after,
          ip,
          userAgent
        });

        results.push({ id, success: true });
      } catch (err) {
        results.push({ id, success: false, reason: err.message });
      }
    }
  });

  return { results };
};
