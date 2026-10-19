const { models } = require('@db');
const passwordService = require('@services/auth/password.service');
const tokenService = require('@services/auth/token.service');
const sessionService = require('@services/auth/session.service');
const ApiError = require('@utils/ApiError');
const { ERROR_CODES, MESSAGES } = require('@constants/messages');

const { User, Setting } = models;

module.exports = async function login(input) {
  const { email, password, userAgent, ip } = input;
  const cleanEmail = email ? email.toLowerCase().trim() : '';

  const user = await User.findOne({ where: { email: cleanEmail } });
  if (!user) {
    throw ApiError.unauthorized(MESSAGES.INVALID_CREDENTIALS, ERROR_CODES.INVALID_CREDENTIALS);
  }

  if (user.status === 'blocked') {
    throw new ApiError(403, MESSAGES.ACCOUNT_BLOCKED, ERROR_CODES.ACCOUNT_BLOCKED);
  }

  const isPasswordValid = passwordService.comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw ApiError.unauthorized(MESSAGES.INVALID_CREDENTIALS, ERROR_CODES.INVALID_CREDENTIALS);
  }

  // Check email verification setting
  const emailVerSetting = await Setting.findOne({ where: { key: 'auth.requireEmailVerification' } });
  let requireVerification = true;
  if (emailVerSetting) {
    let val = emailVerSetting.value;
    if (typeof val === 'string') {
      try { val = JSON.parse(val); } catch { val = true; }
    }
    requireVerification = val !== false;
  }

  if (requireVerification && !user.isEmailVerified) {
    throw new ApiError(403, MESSAGES.EMAIL_NOT_VERIFIED, ERROR_CODES.EMAIL_NOT_VERIFIED);
  }

  // Create session family & tokens
  const { refreshToken, familyId } = await sessionService.createSession({
    actorType: 'user',
    actorId: user.id,
    userAgent,
    ip
  });

  const accessToken = tokenService.generateAccessToken({
    id: user.id,
    actorType: 'user',
    sessionId: familyId
  });

  await user.update({ lastLoginAt: new Date() });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      isEmailVerified: user.isEmailVerified
    }
  };
};
