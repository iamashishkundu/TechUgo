const { models } = require('@db');
const passwordService = require('@services/auth/password.service');
const totpService = require('@services/auth/totp.service');
const { decrypt } = require('@utils/crypto');
const ApiError = require('@utils/ApiError');

const { Admin } = models;

module.exports = async function disableTwoFactor({ subadminId, password, code }) {
  const subadmin = await Admin.findByPk(subadminId);
  if (!subadmin) {
    throw ApiError.notFound('Subadmin not found');
  }

  const isPasswordValid = passwordService.comparePassword(password, subadmin.passwordHash);
  if (!isPasswordValid) {
    throw ApiError.badRequest('Incorrect password');
  }

  if (!subadmin.twoFactorEnabled || !subadmin.twoFactorSecret) {
    throw ApiError.badRequest('Two-factor authentication is not enabled');
  }

  const secret = decrypt(subadmin.twoFactorSecret);
  const isValid = totpService.verifyTotp(code, secret);
  if (!isValid) {
    throw ApiError.badRequest('Invalid verification code');
  }

  await subadmin.update({
    twoFactorEnabled: false,
    twoFactorSecret: null
  });

  return { success: true };
};
