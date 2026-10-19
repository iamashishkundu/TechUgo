const { models } = require('@db');
const authTokenService = require('@services/auth/authToken.service');
const mailerService = require('@services/mailer.service');
const env = require('@config/env');

const { Admin } = models;

module.exports = async function forgotPassword({ email }) {
  const cleanEmail = email ? email.toLowerCase().trim() : '';
  const subadmin = await Admin.findOne({ where: { email: cleanEmail, type: 'subadmin' } });

  let rawToken = null;

  if (subadmin && subadmin.status !== 'blocked') {
    const tokenResult = await authTokenService.createToken({
      actorType: 'subadmin',
      actorId: subadmin.id,
      purpose: 'password_reset',
      expiryHours: 1
    });
    rawToken = tokenResult.rawToken;

    await mailerService.sendEmail({
      to: subadmin.email,
      subject: 'Staff Password Reset Request',
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
