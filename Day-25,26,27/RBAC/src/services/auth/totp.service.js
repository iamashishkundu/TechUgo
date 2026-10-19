const { authenticator } = require('otplib');
const env = require('@config/env');

const totpService = {
  generateSecret() {
    return authenticator.generateSecret();
  },

  generateOtpauthUrl(email, secret) {
    return authenticator.keyuri(email, env.TOTP_ISSUER, secret);
  },

  verifyTotp(token, secret) {
    if (!token || !secret) return false;
    try {
      return authenticator.check(token, secret);
    } catch {
      return false;
    }
  }
};

module.exports = totpService;
