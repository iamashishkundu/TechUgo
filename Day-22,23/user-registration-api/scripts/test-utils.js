const assert = require('assert');
const AppError = require('../src/v1/user/utils/AppError');
const { hashPassword, comparePassword } = require('../src/v1/user/utils/password');
const { signToken, verifyToken } = require('../src/v1/user/utils/jwt');

(async () => {
  const err = new AppError('Email already in use', 409);
  assert(err instanceof Error && err.statusCode === 409);
  console.log('AppError OK');

  const hash = await hashPassword('Secret123!');
  assert(hash !== 'Secret123!');
  assert((await comparePassword('Secret123!', hash)) === true);
  assert((await comparePassword('wrong', hash)) === false);
  console.log('password OK');

  const token = signToken({ id: 1, role: 'user' });
  const decoded = verifyToken(token);
  assert(decoded.id === 1 && decoded.role === 'user');
  assert.throws(() => verifyToken(token + 'x'), /invalid/i);
  console.log('jwt OK');
})().catch((e) => {
  console.error('FAILED:', e.message);
  process.exitCode = 1;
});
