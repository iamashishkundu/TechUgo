const { models } = require('@db');
const tokenService = require('@services/auth/token.service');
const sessionService = require('@services/auth/session.service');
const totpService = require('@services/auth/totp.service');
const { decrypt } = require('@utils/crypto');
const ApiError = require('@utils/ApiError');

const { Admin } = models;

module.exports = async function verifyTwoFactorLogin({ twoFactorToken, code, userAgent, ip }) {
  const decoded = tokenService.verifyTwoFactorToken(twoFactorToken);

  if (decoded.actorType !== 'subadmin') {
    throw ApiError.unauthorized('Invalid token for subadmin account');
  }

  const subadmin = await Admin.findByPk(decoded.sub);
  if (!subadmin || subadmin.type !== 'subadmin' || subadmin.status === 'blocked') {
    throw ApiError.unauthorized('Invalid credentials or account is blocked');
  }

  if (!subadmin.twoFactorEnabled || !subadmin.twoFactorSecret) {
    throw ApiError.badRequest('Two-factor authentication is not enabled for this account');
  }

  const secret = decrypt(subadmin.twoFactorSecret);
  const isValidCode = totpService.verifyTotp(code, secret);
  if (!isValidCode) {
    throw ApiError.unauthorized('Invalid two-factor authentication code');
  }

  const { refreshToken, familyId } = await sessionService.createSession({
    actorType: 'subadmin',
    actorId: subadmin.id,
    userAgent,
    ip
  });

  const accessToken = tokenService.generateAccessToken({
    id: subadmin.id,
    actorType: 'subadmin',
    sessionId: familyId
  });

  await subadmin.update({ lastLoginAt: new Date() });

  return {
    accessToken,
    refreshToken,
    subadmin: {
      id: subadmin.id,
      type: subadmin.type,
      fullName: subadmin.fullName,
      email: subadmin.email,
      phone: subadmin.phone,
      avatarUrl: subadmin.avatarUrl,
      twoFactorEnabled: subadmin.twoFactorEnabled
    }
  };
};
