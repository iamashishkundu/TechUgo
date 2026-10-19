const { models } = require('@db');
const totpService = require('@services/auth/totp.service');
const { decrypt } = require('@utils/crypto');
const ApiError = require('@utils/ApiError');

const { Admin } = models;

module.exports = async function enableTwoFactor({ adminId, code }) {
  const admin = await Admin.findByPk(adminId);
  if (!admin) {
    throw ApiError.notFound('Admin not found');
  }

  if (!admin.twoFactorSecret) {
    throw ApiError.badRequest('Two-factor setup has not been initiated');
  }

  const secret = decrypt(admin.twoFactorSecret);
  const isValid = totpService.verifyTotp(code, secret);
  if (!isValid) {
    throw ApiError.badRequest('Invalid verification code');
  }

  await admin.update({ twoFactorEnabled: true });

  return { success: true };
};
