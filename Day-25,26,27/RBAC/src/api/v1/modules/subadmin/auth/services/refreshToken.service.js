const sessionService = require('@services/auth/session.service');
const tokenService = require('@services/auth/token.service');
const ApiError = require('@utils/ApiError');

module.exports = async function refreshToken({ refreshToken: rawRefreshToken, userAgent, ip }) {
  const session = await sessionService.rotateRefreshToken({
    rawRefreshToken,
    userAgent,
    ip
  });

  if (session.actorType !== 'subadmin') {
    await sessionService.revokeFamily(session.familyId);
    throw ApiError.unauthorized('Invalid refresh token for subadmin account');
  }

  const accessToken = tokenService.generateAccessToken({
    id: session.actorId,
    actorType: 'subadmin',
    sessionId: session.familyId
  });

  return {
    accessToken,
    refreshToken: session.refreshToken
  };
};
