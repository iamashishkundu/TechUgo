const { sequelize, models } = require('@db');
const authTokenService = require('@services/auth/authToken.service');
const passwordService = require('@services/auth/password.service');
const sessionService = require('@services/auth/session.service');
const ApiError = require('@utils/ApiError');

const { Admin } = models;

module.exports = async function resetPassword({ token, newPassword }) {
  return await sequelize.transaction(async (t) => {
    const { actorType, actorId } = await authTokenService.verifyAndConsumeToken(
      { rawToken: token, purpose: 'password_reset' },
      { transaction: t }
    );

    if (actorType !== 'admin') {
      throw ApiError.badRequest('Invalid token for admin account');
    }

    const admin = await Admin.findByPk(actorId, { transaction: t });
    if (!admin || admin.type !== 'super_admin') {
      throw ApiError.notFound('Admin not found');
    }

    const passwordHash = passwordService.hashPassword(newPassword);
    await admin.update({ passwordHash }, { transaction: t });

    // Revoke all existing sessions
    await sessionService.revokeAllForActor('admin', admin.id, { transaction: t });

    return { success: true };
  });
};
