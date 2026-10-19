const { models } = require('@db');
const passwordService = require('@services/auth/password.service');
const sessionService = require('@services/auth/session.service');
const ApiError = require('@utils/ApiError');

const { Admin } = models;

module.exports = async function changePassword({ subadminId, oldPassword, newPassword }) {
  const subadmin = await Admin.findByPk(subadminId);
  if (!subadmin) {
    throw ApiError.notFound('Subadmin not found');
  }

  const isOldValid = passwordService.comparePassword(oldPassword, subadmin.passwordHash);
  if (!isOldValid) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  const passwordHash = passwordService.hashPassword(newPassword);
  await subadmin.update({ passwordHash });

  // Revoke all existing sessions
  await sessionService.revokeAllForActor('subadmin', subadmin.id);

  return { success: true };
};
