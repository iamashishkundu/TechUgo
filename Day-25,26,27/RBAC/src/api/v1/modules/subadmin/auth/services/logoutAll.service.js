const sessionService = require('@services/auth/session.service');

module.exports = async function logoutAll({ subadminId }) {
  await sessionService.revokeAllForActor('subadmin', subadminId);
  return { success: true };
};
