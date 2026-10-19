const { models } = require('@db');
const totpService = require('@services/auth/totp.service');
const { decrypt } = require('@utils/crypto');
const ApiError = require('@utils/ApiError');

const { Admin } = models;

module.exports = async function enableTwoFactor({ subadminId, code }) {
  const subadmin = await Admin.findByPk(subadminId);
  if (!subadmin) {
    throw ApiError.notFound('Subadmin not found');
  }

  if (!subadmin.twoFactorSecret) {
    throw ApiError.badRequest('Two-factor setup has not been initiated');
  }

  const secret = decrypt(subadmin.twoFactorSecret);
  const isValid = totpService.verifyTotp(code, secret);
  if (!isValid) {
    throw ApiError.badRequest('Invalid verification code');
  }

  await subadmin.update({ twoFactorEnabled: true });

  return { success: true };
};
