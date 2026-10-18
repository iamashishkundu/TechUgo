require('dotenv').config();
const { z } = require('zod');
const pool = require('../user/config/db');
const Admin = require('./models/admin.model');
const fields = require('../user/validators/fields');
const { hashPassword } = require('../user/utils/password');

// Reuse the same rules the API enforces, so the seed can't create a weak admin
const seedSchema = z.object({
  name: fields.name,
  email: fields.email,
  password: fields.password,
});

(async () => {
  try {
    const parsed = seedSchema.safeParse({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });
    if (!parsed.success) {
      console.error('Invalid ADMIN_* values in .env:');
      parsed.error.issues.forEach((i) => console.error(`- ${i.path.join('.')}: ${i.message}`));
      process.exitCode = 1;
      return;
    }

    const { name, email, password } = parsed.data;

    if (await Admin.emailExists(email)) {
      console.log(`A user with ${email} already exists. Nothing changed.`);
      return;
    }

    const passwordHash = await hashPassword(password);
    const admin = await Admin.create({ name, email, passwordHash, role: 'admin' });
    console.log(`Admin created: id=${admin.id}, email=${admin.email}`);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
