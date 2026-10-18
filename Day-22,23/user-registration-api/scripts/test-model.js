const assert = require('assert');
const pool = require('../src/v1/user/config/db');
const User = require('../src/v1/user/models/user.model');
const Admin = require('../src/v1/admin/models/admin.model');

(async () => {
  const email = `test_${Date.now()}@example.com`;
  const adminEmail = `test_admin_${Date.now()}@example.com`;
  try {
    // ---- user model ----
    assert.strictEqual(await User.emailExists(email), false);

    const created = await User.create({ name: 'Test User', email, passwordHash: 'fakehash', role: 'admin' });
    const id = created.id;
    assert.strictEqual(created.role, 'user', 'user model must ignore an injected role');
    assert(!('password_hash' in created), 'public reads must not expose the hash');
    console.log('user.create OK');

    assert.strictEqual(await User.emailExists(email), true);
    assert.strictEqual(await User.emailExists(email, id), false); // excluding own row
    console.log('user.emailExists OK');

    const withPw = await User.findByEmailWithPassword(email);
    assert.strictEqual(withPw.password_hash, 'fakehash');
    assert.strictEqual(await User.findByEmailWithPassword('nobody@x.com'), null);
    console.log('user.findByEmailWithPassword OK');

    // Whitelist: id, is_admin AND role must all be ignored by the user model
    const updated = await User.update(id, { name: 'Renamed', id: 999999, is_admin: 1, role: 'admin' });
    assert.strictEqual(updated.id, id);
    assert.strictEqual(updated.name, 'Renamed');
    assert.strictEqual(updated.role, 'user', 'user model must never change a role');
    console.log('user.update + whitelist OK');

    // The user module has no way to list or delete
    assert.strictEqual(User.remove, undefined);
    assert.strictEqual(User.findAll, undefined);
    console.log('user model has no remove/findAll OK');

    await assert.rejects(
      User.create({ name: 'Dup', email, passwordHash: 'x' }),
      (err) => err.code === 'ER_DUP_ENTRY'
    );
    console.log('duplicate rejected OK');

    // ---- admin model ----
    const all = await Admin.findAll();
    assert(all.some((u) => u.id === id));
    assert(all.every((u) => !('password_hash' in u)));
    console.log('admin.findAll OK');

    assert.strictEqual((await Admin.findById(id)).email, email);
    assert.strictEqual(await Admin.findById(999999999), null);
    console.log('admin.findById OK');

    const promoted = await Admin.update(id, { role: 'admin', is_admin: 1 });
    assert.strictEqual(promoted.role, 'admin');
    console.log('admin.update (role allowed, junk ignored) OK');

    const seeded = await Admin.create({ name: 'Seed', email: adminEmail, passwordHash: 'x', role: 'admin' });
    assert.strictEqual(seeded.role, 'admin');
    assert.strictEqual(await Admin.emailExists(adminEmail), true);
    console.log('admin.create with role OK');

    assert.strictEqual(await Admin.remove(id), true);
    assert.strictEqual(await Admin.findById(id), null);
    assert.strictEqual(await Admin.remove(id), false);
    console.log('admin.remove OK');
  } catch (err) {
    console.error('FAILED:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.execute('DELETE FROM users WHERE email IN (?, ?)', [email, adminEmail]); // cleanup
    await pool.end();
  }
})();
