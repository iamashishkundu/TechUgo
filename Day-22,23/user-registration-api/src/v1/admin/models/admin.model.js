const pool = require('../../user/config/db');

const PUBLIC_COLUMNS = 'id, name, email, role, created_at, updated_at';

// Admins may also change role
const UPDATABLE = {
  name: 'name',
  email: 'email',
  passwordHash: 'password_hash',
  role: 'role',
};

const findAll = async () => {
  const [rows] = await pool.execute(
    `SELECT ${PUBLIC_COLUMNS} FROM users ORDER BY id`
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
};

const emailExists = async (email, excludeId = null) => {
  const [rows] = await pool.execute(
    'SELECT 1 FROM users WHERE email = ? AND id <> ? LIMIT 1',
    [email, excludeId ?? 0]
  );
  return rows.length > 0;
};

// Used by the seed script to create the first admin
const create = async ({ name, email, passwordHash, role = 'user' }) => {
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, role]
  );
  return findById(result.insertId);
};

const update = async (id, fields) => {
  const entries = Object.entries(fields).filter(([key]) =>
    Object.hasOwn(UPDATABLE, key)
  );
  if (entries.length === 0) return findById(id);

  const setClause = entries.map(([key]) => `${UPDATABLE[key]} = ?`).join(', ');
  const values = entries.map(([, value]) => value);

  await pool.execute(`UPDATE users SET ${setClause} WHERE id = ?`, [
    ...values,
    id,
  ]);
  return findById(id);
};

// Returns true if a row was deleted, false if the id didn't exist
const remove = async (id) => {
  const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = { findAll, findById, emailExists, create, update, remove };
