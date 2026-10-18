1.   CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; 
2.  id            INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,  what is unsigned
3.    UNIQUE KEY uq_users_email (email)
4. Explain this
class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // marks "expected" errors, as opposed to bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

5. explain?
// excludeId lets "update my email" ignore the user's own row
const emailExists = async (email, excludeId = null) => {
  const [rows] = await pool.execute(
    'SELECT 1 FROM users WHERE email = ? AND id <> ? LIMIT 1',
    [email, excludeId ?? 0]
  );
  return rows.length > 0;
};

6. 