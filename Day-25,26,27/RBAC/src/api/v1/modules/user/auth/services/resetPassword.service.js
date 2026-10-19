const { sequelize, models } = require('@db');
const authTokenService = require('@services/auth/authToken.service');
const passwordService = require('@services/auth/password.service');
const sessionService = require('@services/auth/session.service');
const ApiError = require('@utils/ApiError');

const { User } = models;

module.exports = async function resetPassword({ token, newPassword }) {
  return await sequelize.transaction(async (t) => {
    const { actorType, actorId } = await authTokenService.verifyAndConsumeToken(
      { rawToken: token, purpose: 'password_reset' },
      { transaction: t }
    );

    if (actorType !== 'user') {
      throw ApiError.badRequest('Invalid token for user account');
    }

    const user = await User.findByPk(actorId, { transaction: t });
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const passwordHash = passwordService.hashPassword(newPassword);
    await user.update({ passwordHash }, { transaction: t });

    // Revoke all existing sessions
    await sessionService.revokeAllForActor('user', user.id, { transaction: t });

    return { success: true };
  });
};
