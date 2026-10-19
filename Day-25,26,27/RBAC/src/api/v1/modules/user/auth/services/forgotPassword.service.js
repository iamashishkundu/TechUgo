const { models } = require('@db');
const authTokenService = require('@services/auth/authToken.service');
const mailerService = require('@services/mailer.service');
const env = require('@config/env');

const { User } = models;

module.exports = async function forgotPassword({ email }) {
  const cleanEmail = email ? email.toLowerCase().trim() : '';
  const user = await User.findOne({ where: { email: cleanEmail } });

  let rawToken = null;

  if (user && user.status !== 'blocked') {
    const tokenResult = await authTokenService.createToken({
      actorType: 'user',
      actorId: user.id,
      purpose: 'password_reset',
      expiryHours: 1
    });
    rawToken = tokenResult.rawToken;

    await mailerService.sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: `Reset your password using token: ${rawToken}`,
      token: rawToken
    });
  }

  const responseData = {
    message: 'If the email exists, a password reset link has been sent'
  };

  if (rawToken && env.NODE_ENV !== 'production') {
    responseData.devToken = rawToken;
  }

  return responseData;
};
