const assert = require('assert');
const pool = require('../src/v1/user/config/db');
const { verifyToken } = require('../src/v1/user/utils/jwt');
const auth = require('../src/v1/user/services/auth.service');
const userSvc = require('../src/v1/user/services/user.service');
const adminSvc = require('../src/v1/admin/services/admin.service');

const status = (code) => (err) => err.statusCode === code;

(async () => {
  const stamp = Date.now();
  const emailA = `svc_a_${stamp}@example.com`;
  const emailB = `svc_b_${stamp}@example.com`;
  try {
    const a = await auth.register({ name: 'A', email: emailA, password: 'Secret123!', role: 'admin' });
    assert.strictEqual(a.role, 'user', 'injected role must be ignored');
    assert(!('password_hash' in a));
    await assert.rejects(auth.register({ name: 'A', email: emailA, password: 'x' }), status(409));
    console.log('register OK');

    const { token, user } = await auth.login({ email: emailA, password: 'Secret123!' });
    const decoded = verifyToken(token);
    assert(decoded.id === a.id && decoded.role === 'user');
    assert(!('password_hash' in user));
    await assert.rejects(auth.login({ email: emailA, password: 'wrong' }), status(401));
    await assert.rejects(auth.login({ email: 'nobody@example.com', password: 'x' }), status(401));
    console.log('login OK');

    const b = await auth.register({ name: 'B', email: emailB, password: 'Secret123!' });
    assert.strictEqual((await userSvc.getProfile(a.id)).email, emailA);
    await assert.rejects(userSvc.getProfile(999999999), status(404));
    const renamed = await userSvc.updateProfile(a.id, { name: 'A Renamed' });
    assert.strictEqual(renamed.name, 'A Renamed');
    await assert.rejects(userSvc.updateProfile(a.id, { email: emailB }), status(409));
    await userSvc.updateProfile(a.id, { email: emailA }); // own email is fine
    await userSvc.updateProfile(a.id, { password: 'NewSecret456!' });
    await auth.login({ email: emailA, password: 'NewSecret456!' });
    console.log('user service OK');

    assert((await adminSvc.listUsers()).some((u) => u.id === b.id));
    const promoted = await adminSvc.updateUser(b.id, { role: 'admin' });
    assert.strictEqual(promoted.role, 'admin');
    await assert.rejects(adminSvc.deleteUser(b.id, b.id), status(400));
    await adminSvc.deleteUser(b.id, a.id); // admin B deletes user A
    await assert.rejects(adminSvc.deleteUser(b.id, a.id), status(404));
    console.log('admin service OK');
  } catch (err) {
    console.error('FAILED:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.execute('DELETE FROM users WHERE email IN (?, ?)', [emailA, emailB]);
    await pool.end();
  }
})();
