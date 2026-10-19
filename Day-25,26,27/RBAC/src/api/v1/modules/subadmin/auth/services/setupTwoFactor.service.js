const { models } = require('@db');
const totpService = require('@services/auth/totp.service');
const { encrypt } = require('@utils/crypto');
const ApiError = require('@utils/ApiError');

const { Admin } = models;

module.exports = async function setupTwoFactor({ subadminId }) {
  const subadmin = await Admin.findByPk(subadminId);
  if (!subadmin) {
    throw ApiError.notFound('Subadmin not found');
  }

  const secret = totpService.generateSecret();
  const encryptedSecret = encrypt(secret);

  await subadmin.update({
    twoFactorSecret: encryptedSecret,
    twoFactorEnabled: false
  });

  const otpauthUrl = totpService.generateOtpauthUrl(subadmin.email, secret);

  return {
    secret,
    otpauthUrl
  };
};
