require('dotenv').config();
const pool = require('../src/v1/user/config/db');
const Admin = require('../src/v1/admin/models/admin.model');
const { hashPassword } = require('../src/v1/user/utils/password');

const BASE = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
const API = '/api/v1';
const stamp = Date.now();
const userEmail = `e2e_user_${stamp}@example.com`;
const adminEmail = `e2e_admin_${stamp}@example.com`;
const PASSWORD = 'Secret123';

let passed = 0;
let failed = 0;

const call = async (method, path, { token, body } = {}) => {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
};

const check = (name, actual, expected) => {
  const ok = actual === expected;
  ok ? passed++ : failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `  (got ${actual}, expected ${expected})`}`);
};

(async () => {
  try {
    check('GET /health', (await call('GET', '/health')).status, 200);

    // --- register ---
    const REG = `${API}/auth/register`;
    let r = await call('POST', REG, { body: { name: 'E2E User', email: userEmail, password: PASSWORD } });
    check('register -> 201', r.status, 201);
    check('register: role is user', r.body.data.role, 'user');
    check('register: no hash leaked', 'password_hash' in r.body.data, false);
    const userId = r.body.data.id;

    check('register duplicate -> 409', (await call('POST', REG, { body: { name: 'E2E User', email: userEmail, password: PASSWORD } })).status, 409);
    check('register invalid -> 400', (await call('POST', REG, { body: { name: 'X', email: 'bad', password: 'short' } })).status, 400);
    check('register with role -> 400', (await call('POST', REG, { body: { name: 'Hacker', email: `h_${stamp}@example.com`, password: PASSWORD, role: 'admin' } })).status, 400);

    // --- login ---
    const LOGIN = `${API}/auth/login`;
    r = await call('POST', LOGIN, { body: { email: userEmail, password: PASSWORD } });
    check('login -> 200', r.status, 200);
    const userToken = r.body.data.token;
    const wrong = await call('POST', LOGIN, { body: { email: userEmail, password: 'Wrong123' } });
    const unknown = await call('POST', LOGIN, { body: { email: `nobody_${stamp}@example.com`, password: PASSWORD } });
    check('login wrong password -> 401', wrong.status, 401);
    check('login unknown email -> 401', unknown.status, 401);
    check('login: same message for both', wrong.body.message === unknown.body.message, true);

    // --- create an admin directly (the API can't), then log in ---
    const admin = await Admin.create({ name: 'E2E Admin', email: adminEmail, passwordHash: await hashPassword(PASSWORD), role: 'admin' });
    r = await call('POST', LOGIN, { body: { email: adminEmail, password: PASSWORD } });
    const adminToken = r.body.data.token;

    // --- /me ---
    const ME = `${API}/users/me`;
    check('GET /me no token -> 401', (await call('GET', ME)).status, 401);
    check('GET /me garbage token -> 401', (await call('GET', ME, { token: 'garbage' })).status, 401);
    r = await call('GET', ME, { token: userToken });
    check('GET /me -> 200', r.status, 200);
    check('GET /me: no hash leaked', 'password_hash' in r.body.data, false);
    check('PATCH /me name -> 200', (await call('PATCH', ME, { token: userToken, body: { name: 'Renamed' } })).status, 200);
    check('PATCH /me role -> 400', (await call('PATCH', ME, { token: userToken, body: { role: 'admin' } })).status, 400);
    check('PATCH /me empty -> 400', (await call('PATCH', ME, { token: userToken, body: {} })).status, 400);
    check('PATCH /me taken email -> 409', (await call('PATCH', ME, { token: userToken, body: { email: adminEmail } })).status, 409);

    // --- admin matrix ---
    const A = `${API}/admin/users`;
    check('admin list no token -> 401', (await call('GET', A)).status, 401);
    check('admin list as user -> 403', (await call('GET', A, { token: userToken })).status, 403);
    r = await call('GET', A, { token: adminToken });
    check('admin list as admin -> 200', r.status, 200);
    check('admin list: no hash leaked', r.body.data.some((u) => 'password_hash' in u), false);
    check('admin get one -> 200', (await call('GET', `${A}/${userId}`, { token: adminToken })).status, 200);
    check('admin get bad id -> 400', (await call('GET', `${A}/abc`, { token: adminToken })).status, 400);
    check('admin get missing -> 404', (await call('GET', `${A}/999999999`, { token: adminToken })).status, 404);
    check('admin patch as user -> 403', (await call('PATCH', `${A}/${userId}`, { token: userToken, body: { name: 'Nope' } })).status, 403);
    check('admin patch bad role -> 400', (await call('PATCH', `${A}/${userId}`, { token: adminToken, body: { role: 'superuser' } })).status, 400);
    r = await call('PATCH', `${A}/${userId}`, { token: adminToken, body: { name: 'By Admin' } });
    check('admin patch -> 200', r.status, 200);
    check('admin delete self -> 400', (await call('DELETE', `${A}/${admin.id}`, { token: adminToken })).status, 400);
    check('admin delete as user -> 403', (await call('DELETE', `${A}/${userId}`, { token: userToken })).status, 403);
    check('admin delete -> 204', (await call('DELETE', `${A}/${userId}`, { token: adminToken })).status, 204);
    check('admin delete again -> 404', (await call('DELETE', `${A}/${userId}`, { token: adminToken })).status, 404);

    // --- misc ---
    check('unknown route -> 404', (await call('GET', `${API}/nope`)).status, 404);
    check('old unversioned path -> 404', (await call('POST', '/api/auth/login', { body: {} })).status, 404);
  } catch (err) {
    failed++;
    console.error('Script error (is the server running?):', err.message);
  } finally {
    await pool.execute('DELETE FROM users WHERE email IN (?, ?)', [userEmail, adminEmail]);
    await pool.end();
    console.log(`\n${passed} passed, ${failed} failed`);
    process.exitCode = failed ? 1 : 0;
  }
})();
