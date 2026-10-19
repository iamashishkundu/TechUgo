const { models } = require('@db');
const passwordService = require('@services/auth/password.service');
const tokenService = require('@services/auth/token.service');
const sessionService = require('@services/auth/session.service');
const ApiError = require('@utils/ApiError');
const { ERROR_CODES, MESSAGES } = require('@constants/messages');

const { Admin } = models;

module.exports = async function login({ email, password, userAgent, ip }) {
  const cleanEmail = email ? email.toLowerCase().trim() : '';
  const subadmin = await Admin.findOne({ where: { email: cleanEmail } });

  // Only subadmin allowed for subadmin auth
  if (!subadmin || subadmin.type !== 'subadmin') {
    throw ApiError.unauthorized(MESSAGES.INVALID_CREDENTIALS, ERROR_CODES.INVALID_CREDENTIALS);
  }

  if (subadmin.status === 'blocked') {
    throw new ApiError(403, MESSAGES.ACCOUNT_BLOCKED, ERROR_CODES.ACCOUNT_BLOCKED);
  }

  const isPasswordValid = passwordService.comparePassword(password, subadmin.passwordHash);
  if (!isPasswordValid) {
    throw ApiError.unauthorized(MESSAGES.INVALID_CREDENTIALS, ERROR_CODES.INVALID_CREDENTIALS);
  }

  // 2FA check
  if (subadmin.twoFactorEnabled) {
    const twoFactorToken = tokenService.generateTwoFactorToken({
      id: subadmin.id,
      actorType: 'subadmin'
    });
    return {
      twoFactorRequired: true,
      twoFactorToken
    };
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
    twoFactorRequired: false,
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
