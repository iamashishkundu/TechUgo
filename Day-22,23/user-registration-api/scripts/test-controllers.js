const assert = require('assert');
const pool = require('../src/v1/user/config/db');
const authController = require('../src/v1/user/controllers/auth.controller');
const userController = require('../src/v1/user/controllers/user.controller');
const adminController = require('../src/v1/admin/controllers/admin.controller');

// A fake res that records what the controller did
const mockRes = () => {
  const res = { code: 200, body: undefined, ended: false };
  res.status = (c) => { res.code = c; return res; };
  res.json = (b) => { res.body = b; return res; };
  res.end = () => { res.ended = true; return res; };
  return res;
};

(async () => {
  const stamp = Date.now();
  const emailA = `ctl_a_${stamp}@example.com`;
  const emailB = `ctl_b_${stamp}@example.com`;
  try {
    let res = mockRes();
    await authController.register({ body: { name: 'Ctl A', email: emailA, password: 'Secret123' } }, res);
    assert.strictEqual(res.code, 201);
    assert(res.body.success === true && res.body.data.email === emailA);
    assert(!('password_hash' in res.body.data));
    const idA = res.body.data.id;
    console.log('register controller OK');

    res = mockRes();
    await authController.login({ body: { email: emailA, password: 'Secret123' } }, res);
    assert.strictEqual(res.code, 200);
    assert(typeof res.body.data.token === 'string');
    console.log('login controller OK');

    await assert.rejects(
      authController.login({ body: { email: emailA, password: 'wrong' } }, mockRes()),
      (err) => err.statusCode === 401
    );
    console.log('errors bubble up OK');

    res = mockRes();
    await userController.getMe({ user: { id: idA, role: 'user' } }, res);
    assert.strictEqual(res.body.data.id, idA);
    res = mockRes();
    await userController.updateMe({ user: { id: idA, role: 'user' }, body: { name: 'Renamed' } }, res);
    assert.strictEqual(res.body.data.name, 'Renamed');
    console.log('user controller OK');

    res = mockRes();
    await authController.register({ body: { name: 'Ctl B', email: emailB, password: 'Secret123' } }, res);
    const idB = res.body.data.id;
    const admin = { id: idB, role: 'admin' };

    res = mockRes();
    await adminController.listUsers({ user: admin }, res);
    assert(res.body.data.some((u) => u.id === idA));

    res = mockRes();
    await adminController.getUser({ user: admin, validated: { params: { id: idA } } }, res);
    assert.strictEqual(res.body.data.id, idA);

    res = mockRes();
    await adminController.updateUser(
      { user: admin, validated: { params: { id: idA } }, body: { role: 'admin' } }, res
    );
    assert.strictEqual(res.body.data.role, 'admin');

    res = mockRes();
    await adminController.deleteUser({ user: admin, validated: { params: { id: idA } } }, res);
    assert(res.code === 204 && res.ended === true);
    console.log('admin controller OK');
  } catch (err) {
    console.error('FAILED:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.execute('DELETE FROM users WHERE email IN (?, ?)', [emailA, emailB]);
    await pool.end();
  }
})();
