const { models } = require('@db');
const passwordService = require('@services/auth/password.service');
const sessionService = require('@services/auth/session.service');
const ApiError = require('@utils/ApiError');

const { User } = models;

module.exports = async function changePassword({ userId, oldPassword, newPassword }) {
  const user = await User.findByPk(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const isOldValid = passwordService.comparePassword(oldPassword, user.passwordHash);
  if (!isOldValid) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  const passwordHash = passwordService.hashPassword(newPassword);
  await user.update({ passwordHash });

  // Revoke all existing sessions
  await sessionService.revokeAllForActor('user', user.id);

  return { success: true };
};
