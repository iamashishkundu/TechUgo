const { sequelize, models } = require('@db');
const sessionService = require('@services/auth/session.service');
const auditService = require('@services/audit.service');

const { User } = models;

module.exports = async function bulkAction({ ids, action, staffUser, ip, userAgent }) {
  const results = [];

  await sequelize.transaction(async (t) => {
    for (const id of ids) {
      try {
        const user = await User.findByPk(id, { transaction: t });

        if (!user) {
          results.push({ id, success: false, reason: 'User not found' });
          continue;
        }

        const before = user.toJSON();

        if (action === 'block') {
          await user.update({ status: 'blocked' }, { transaction: t });
          await sessionService.revokeAllForActor('user', id, { transaction: t });
        } else if (action === 'unblock') {
          await user.update({ status: 'active' }, { transaction: t });
        } else if (action === 'delete') {
          await user.destroy({ transaction: t });
          await sessionService.revokeAllForActor('user', id, { transaction: t });
        }

        const after = user.toJSON();

        auditService.log({
          actorType: staffUser ? staffUser.type : 'admin',
          actorId: staffUser ? staffUser.id : null,
          actorName: staffUser ? staffUser.fullName : null,
          module: 'user_management',
          action: `bulk_${action}`,
          entityType: 'user',
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
