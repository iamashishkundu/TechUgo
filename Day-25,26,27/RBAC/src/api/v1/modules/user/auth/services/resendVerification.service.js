const { models } = require('@db');
const authTokenService = require('@services/auth/authToken.service');
const mailerService = require('@services/mailer.service');
const env = require('@config/env');

const { User } = models;

module.exports = async function resendVerification({ email }) {
  const cleanEmail = email ? email.toLowerCase().trim() : '';
  const user = await User.findOne({ where: { email: cleanEmail } });

  let rawToken = null;

  if (user && !user.isEmailVerified && user.status !== 'blocked') {
    const tokenResult = await authTokenService.createToken({
      actorType: 'user',
      actorId: user.id,
      purpose: 'email_verification',
      expiryHours: 24
    });
    rawToken = tokenResult.rawToken;

    await mailerService.sendEmail({
      to: user.email,
      subject: 'Verify your email address',
      text: `Please verify your email using this token: ${rawToken}`,
      token: rawToken
    });
  }

  const responseData = {
    message: 'If the email exists and is not verified, a verification link has been sent'
  };

  if (rawToken && env.NODE_ENV !== 'production') {
    responseData.devToken = rawToken;
  }

  return responseData;
};
