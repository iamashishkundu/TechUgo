const assert = require('assert');
const { ZodError } = require('zod');
const { registerSchema, loginSchema } = require('../src/v1/user/validators/auth.validator');
const { updateProfileSchema } = require('../src/v1/user/validators/user.validator');
const { adminUpdateUserSchema } = require('../src/v1/admin/validators/admin.validator');
const { idParamSchema } = require('../src/v1/user/validators/id.validator');
const validate = require('../src/v1/user/middlewares/validate.middleware');

const ok = (schema, data) => schema.safeParse(data).success;

const parsed = registerSchema.parse({ name: '  Ash  ', email: ' ASH@Example.COM ', password: 'Secret123' });
assert.strictEqual(parsed.name, 'Ash');
assert.strictEqual(parsed.email, 'ash@example.com');
assert(!ok(registerSchema, { name: 'Ash', email: 'a@b.com', password: 'Secret123', role: 'admin' }), 'extra key');
assert(!ok(registerSchema, { name: 'Ash', email: 'not-an-email', password: 'Secret123' }));
assert(!ok(registerSchema, { name: 'Ash', email: 'a@b.com', password: 'short1' }));
assert(!ok(registerSchema, { name: 'Ash', email: 'a@b.com', password: 'nodigitshere' }));
assert(!ok(registerSchema, { name: 'Ash', email: 'a@b.com', password: 'a1' + 'x'.repeat(80) }));
console.log('register schema OK');

assert(ok(loginSchema, { email: 'a@b.com', password: 'anything' }));
assert(!ok(loginSchema, { email: 'a@b.com' }));
console.log('login schema OK');

assert(ok(updateProfileSchema, { name: 'New Name' }));
assert(!ok(updateProfileSchema, {}), 'empty update');
assert(!ok(updateProfileSchema, { role: 'admin' }), 'role not allowed for normal users');
assert(ok(adminUpdateUserSchema, { role: 'admin' }));
assert(!ok(adminUpdateUserSchema, { role: 'superuser' }));
console.log('user schemas OK');

assert.strictEqual(idParamSchema.parse({ id: '5' }).id, 5);
for (const bad of ['abc', '0', '-1', '5.5', '1e3', '99999999999']) {
  assert(!ok(idParamSchema, { id: bad }), `id "${bad}" should fail`);
}
console.log('id schema OK');

const req = { body: { email: 'A@B.com', password: 'x' }, params: { id: '7' }, query: {} };
let called = false;
validate({ body: loginSchema, params: idParamSchema })(req, {}, () => { called = true; });
assert(called && req.body.email === 'a@b.com' && req.validated.params.id === 7);
assert.throws(
  () => validate({ body: loginSchema })({ body: { email: 'bad' } }, {}, () => {}),
  ZodError
);
console.log('validate middleware OK');
