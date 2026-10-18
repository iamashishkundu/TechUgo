const pool = require('../src/v1/user/config/db');

(async () => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    console.log('Connection:', rows);

    const [columns] = await pool.query('DESCRIBE users');
    console.table(columns);
  } catch (err) {
    console.error('DB test failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end(); // lets the script exit instead of hanging
  }
})();
