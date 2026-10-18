const pool = require('../config/db');

// Everything except password_hash: safe to return to callers
const PUBLIC_COLUMNS = 'id, name, email, role, created_at, updated_at';

// Whitelist: input key -> real column. "role" is deliberately NOT here:
// nothing in the user module can ever change a role.
const UPDATABLE = {
  name: 'name',
  email: 'email',
  passwordHash: 'password_hash',
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
};

// The only read that returns password_hash. Used by login.
const findByEmailWithPassword = async (email) => {
  const [rows] = await pool.execute(
    'SELECT id, name, email, role, password_hash FROM users WHERE email = ?',
    [email]
  );
  return rows[0] || null;
};

// excludeId lets "update my email" ignore the user's own row
const emailExists = async (email, excludeId = null) => {
  const [rows] = await pool.execute(
    'SELECT 1 FROM users WHERE email = ? AND id <> ? LIMIT 1',
    [email, excludeId ?? 0]
  );
  return rows.length > 0;
};

// Role is hardcoded to 'user': registration can never create an admin
const create = async ({ name, email, passwordHash }) => {
  const [result] = await pool.execute(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'user')",
    [name, email, passwordHash]
  );
  return findById(result.insertId);
};

const update = async (id, fields) => {
  // Object.hasOwn avoids prototype keys like "constructor" slipping through
  const entries = Object.entries(fields).filter(([key]) =>
    Object.hasOwn(UPDATABLE, key)
  );
  if (entries.length === 0) return findById(id);

  // Column names come from OUR whitelist; values go through placeholders
  const setClause = entries.map(([key]) => `${UPDATABLE[key]} = ?`).join(', ');
  const values = entries.map(([, value]) => value);

  await pool.execute(`UPDATE users SET ${setClause} WHERE id = ?`, [
    ...values,
    id,
  ]);
  return findById(id);
};

module.exports = {
  findById,
  findByEmailWithPassword,
  emailExists,
  create,
  update,
};
