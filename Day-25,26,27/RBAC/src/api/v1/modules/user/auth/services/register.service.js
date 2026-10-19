const { sequelize, models } = require('@db');
const passwordService = require('@services/auth/password.service');
const authTokenService = require('@services/auth/authToken.service');
const mailerService = require('@services/mailer.service');
const tokenService = require('@services/auth/token.service');
const sessionService = require('@services/auth/session.service');
const createWallet = require('@v1/modules/wallet/services/createWallet.service');
const ApiError = require('@utils/ApiError');
const env = require('@config/env');
const { ERROR_CODES, MESSAGES } = require('@constants/messages');

const { User, Cart, Setting } = models;

module.exports = async function register(input) {
  const { fullName, email, phone, password } = input;
  const cleanEmail = email.toLowerCase().trim();

  // Check if registration is allowed
  const allowRegSetting = await Setting.findOne({ where: { key: 'auth.allowRegistration' } });
  if (allowRegSetting) {
    let allowed = allowRegSetting.value;
    if (typeof allowed === 'string') {
      try { allowed = JSON.parse(allowed); } catch { allowed = true; }
    }
    if (allowed === false) {
      throw new ApiError(403, MESSAGES.REGISTRATION_DISABLED, ERROR_CODES.REGISTRATION_DISABLED);
    }
  }

  // Check unique active email
  const existingUser = await User.findOne({ where: { email: cleanEmail } });
  if (existingUser) {
    throw ApiError.conflict('An account with this email address already exists');
  }

  const passwordHash = passwordService.hashPassword(password);

  let rawVerificationToken = null;

  const result = await sequelize.transaction(async (t) => {
    const user = await User.create(
      {
        fullName,
        email: cleanEmail,
        phone,
        passwordHash,
        isEmailVerified: false,
        status: 'active'
      },
      { transaction: t }
    );

    // Create wallet & cart
    await createWallet({ userId: user.id }, { transaction: t });
    await Cart.create({ userId: user.id }, { transaction: t });

    // Generate email verification token
    const { rawToken } = await authTokenService.createToken(
      {
        actorType: 'user',
        actorId: user.id,
        purpose: 'email_verification',
        expiryHours: 24
      },
      { transaction: t }
    );
    rawVerificationToken = rawToken;

    return user;
  });

  // Send verification email via dummy mailer
  await mailerService.sendEmail({
    to: result.email,
    subject: 'Verify your email address',
    text: `Please verify your email using this token: ${rawVerificationToken}`,
    token: rawVerificationToken
  });

  const { refreshToken, familyId } = await sessionService.createSession({
    actorType: 'user',
    actorId: result.id,
    userAgent: input.userAgent || 'PostmanRuntime',
    ip: input.ip || '127.0.0.1'
  });

  const accessToken = tokenService.generateAccessToken({
    id: result.id,
    actorType: 'user',
    sessionId: familyId
  });

  const responseData = {
    accessToken,
    refreshToken,
    tokens: {
      accessToken,
      refreshToken
    },
    user: {
      id: result.id,
      fullName: result.fullName,
      email: result.email,
      phone: result.phone,
      isEmailVerified: result.isEmailVerified
    }
  };

  if (env.NODE_ENV !== 'production') {
    responseData.devToken = rawVerificationToken;
  }

  return responseData;
};
