const sessionService = require('@services/auth/session.service');

module.exports = async function logoutAll({ adminId }) {
  await sessionService.revokeAllForActor('admin', adminId);
  return { success: true };
};
