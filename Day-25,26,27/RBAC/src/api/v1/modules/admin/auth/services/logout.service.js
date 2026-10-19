const sessionService = require('@services/auth/session.service');

module.exports = async function logout({ sessionId }) {
  await sessionService.revokeFamily(sessionId);
  return { success: true };
};
