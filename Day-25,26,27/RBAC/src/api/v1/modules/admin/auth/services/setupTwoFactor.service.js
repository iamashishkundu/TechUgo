const { models } = require('@db');
const totpService = require('@services/auth/totp.service');
const { encrypt } = require('@utils/crypto');
const ApiError = require('@utils/ApiError');

const { Admin } = models;

module.exports = async function setupTwoFactor({ adminId }) {
  const admin = await Admin.findByPk(adminId);
  if (!admin) {
    throw ApiError.notFound('Admin not found');
  }

  const secret = totpService.generateSecret();
  const encryptedSecret = encrypt(secret);

  await admin.update({
    twoFactorSecret: encryptedSecret,
    twoFactorEnabled: false
  });

  const otpauthUrl = totpService.generateOtpauthUrl(admin.email, secret);

  return {
    secret,
    otpauthUrl
  };
};
