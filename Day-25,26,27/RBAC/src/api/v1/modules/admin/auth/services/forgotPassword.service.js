const { models } = require('@db');
const authTokenService = require('@services/auth/authToken.service');
const mailerService = require('@services/mailer.service');
const env = require('@config/env');

const { Admin } = models;

module.exports = async function forgotPassword({ email }) {
  const cleanEmail = email ? email.toLowerCase().trim() : '';
  const admin = await Admin.findOne({ where: { email: cleanEmail, type: 'super_admin' } });

  let rawToken = null;

  if (admin && admin.status !== 'blocked') {
    const tokenResult = await authTokenService.createToken({
      actorType: 'admin',
      actorId: admin.id,
      purpose: 'password_reset',
      expiryHours: 1
    });
    rawToken = tokenResult.rawToken;

    await mailerService.sendEmail({
      to: admin.email,
      subject: 'Admin Password Reset Request',
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
