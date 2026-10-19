const { models } = require('@db');
const passwordService = require('@services/auth/password.service');
const totpService = require('@services/auth/totp.service');
const { decrypt } = require('@utils/crypto');
const ApiError = require('@utils/ApiError');

const { Admin } = models;

module.exports = async function disableTwoFactor({ adminId, password, code }) {
  const admin = await Admin.findByPk(adminId);
  if (!admin) {
    throw ApiError.notFound('Admin not found');
  }

  const isPasswordValid = passwordService.comparePassword(password, admin.passwordHash);
  if (!isPasswordValid) {
    throw ApiError.badRequest('Incorrect password');
  }

  if (!admin.twoFactorEnabled || !admin.twoFactorSecret) {
    throw ApiError.badRequest('Two-factor authentication is not enabled');
  }

  const secret = decrypt(admin.twoFactorSecret);
  const isValid = totpService.verifyTotp(code, secret);
  if (!isValid) {
    throw ApiError.badRequest('Invalid verification code');
  }

  await admin.update({
    twoFactorEnabled: false,
    twoFactorSecret: null
  });

  return { success: true };
};
