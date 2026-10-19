const { models } = require('@db');
const passwordService = require('@services/auth/password.service');
const tokenService = require('@services/auth/token.service');
const sessionService = require('@services/auth/session.service');
const ApiError = require('@utils/ApiError');
const { ERROR_CODES, MESSAGES } = require('@constants/messages');

const { Admin } = models;

module.exports = async function login({ email, password, userAgent, ip }) {
  const cleanEmail = email ? email.toLowerCase().trim() : '';
  const admin = await Admin.findOne({ where: { email: cleanEmail } });

  // Only super_admin allowed for admin auth
  if (!admin || admin.type !== 'super_admin') {
    throw ApiError.unauthorized(MESSAGES.INVALID_CREDENTIALS, ERROR_CODES.INVALID_CREDENTIALS);
  }

  if (admin.status === 'blocked') {
    throw new ApiError(403, MESSAGES.ACCOUNT_BLOCKED, ERROR_CODES.ACCOUNT_BLOCKED);
  }

  const isPasswordValid = passwordService.comparePassword(password, admin.passwordHash);
  if (!isPasswordValid) {
    throw ApiError.unauthorized(MESSAGES.INVALID_CREDENTIALS, ERROR_CODES.INVALID_CREDENTIALS);
  }

  // 2FA check
  if (admin.twoFactorEnabled) {
    const twoFactorToken = tokenService.generateTwoFactorToken({
      id: admin.id,
      actorType: 'admin'
    });
    return {
      twoFactorRequired: true,
      twoFactorToken
    };
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
    twoFactorRequired: false,
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
