const sessionService = require('@services/auth/session.service');

module.exports = async function logoutAll({ userId }) {
  await sessionService.revokeAllForActor('user', userId);
  return { success: true };
};
