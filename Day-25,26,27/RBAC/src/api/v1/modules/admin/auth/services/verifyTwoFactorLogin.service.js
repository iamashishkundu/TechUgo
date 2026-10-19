const { models } = require('@db');
const tokenService = require('@services/auth/token.service');
const sessionService = require('@services/auth/session.service');
const totpService = require('@services/auth/totp.service');
const { decrypt } = require('@utils/crypto');
const ApiError = require('@utils/ApiError');

const { Admin } = models;

module.exports = async function verifyTwoFactorLogin({ twoFactorToken, code, userAgent, ip }) {
  const decoded = tokenService.verifyTwoFactorToken(twoFactorToken);

  if (decoded.actorType !== 'admin') {
    throw ApiError.unauthorized('Invalid token for admin account');
  }

  const admin = await Admin.findByPk(decoded.sub);
  if (!admin || admin.type !== 'super_admin' || admin.status === 'blocked') {
    throw ApiError.unauthorized('Invalid credentials or account is blocked');
  }

  if (!admin.twoFactorEnabled || !admin.twoFactorSecret) {
    throw ApiError.badRequest('Two-factor authentication is not enabled for this account');
  }

  const secret = decrypt(admin.twoFactorSecret);
  const isValidCode = totpService.verifyTotp(code, secret);
  if (!isValidCode) {
    throw ApiError.unauthorized('Invalid two-factor authentication code');
  }

  const { refreshToken, familyId } = await sessionService.createSession({
    actorType: 'admin',
    actorId: admin.id,
    userAgent,
    ip
  });

  const accessToken = tokenService.generateAccessToken({
    id: admin.id,
    actorType: 'admin',
    sessionId: familyId
  });

  await admin.update({ lastLoginAt: new Date() });

  return {
    accessToken,
    refreshToken,
    admin: {
      id: admin.id,
      type: admin.type,
      fullName: admin.fullName,
      email: admin.email,
      phone: admin.phone,
      avatarUrl: admin.avatarUrl,
      twoFactorEnabled: admin.twoFactorEnabled
    }
  };
};
