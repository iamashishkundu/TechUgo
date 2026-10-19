const { models } = require('@db');
const passwordService = require('@services/auth/password.service');
const sessionService = require('@services/auth/session.service');
const ApiError = require('@utils/ApiError');

const { Admin } = models;

module.exports = async function changePassword({ adminId, oldPassword, newPassword }) {
  const admin = await Admin.findByPk(adminId);
  if (!admin) {
    throw ApiError.notFound('Admin not found');
  }

  const isOldValid = passwordService.comparePassword(oldPassword, admin.passwordHash);
  if (!isOldValid) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  const passwordHash = passwordService.hashPassword(newPassword);
  await admin.update({ passwordHash });

  // Revoke all existing sessions
  await sessionService.revokeAllForActor('admin', admin.id);

  return { success: true };
};
