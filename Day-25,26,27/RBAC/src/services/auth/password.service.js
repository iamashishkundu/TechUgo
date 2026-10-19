const bcrypt = require('bcryptjs');
const env = require('@config/env');

const passwordPolicyRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const passwordService = {
  hashPassword(password) {
    return bcrypt.hashSync(password, env.BCRYPT_ROUNDS);
  },

  comparePassword(plainPassword, passwordHash) {
    if (!plainPassword || !passwordHash) return false;
    return bcrypt.compareSync(plainPassword, passwordHash);
  },

  isValidPassword(password) {
    if (typeof password !== 'string') return false;
    return passwordPolicyRegex.test(password);
  }
};

module.exports = passwordService;
