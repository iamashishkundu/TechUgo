require('dotenv').config();
const app = require('./app');
const pool = require('./v1/user/config/db');

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await pool.query('SELECT 1'); // fail fast if the DB is unreachable
    console.log('Database connected');

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Close the server and the pool cleanly on Ctrl+C
    process.on('SIGINT', () => {
      server.close(async () => {
        await pool.end();
        process.exit(0);
      });
    });
  } catch (err) {
    console.error('Startup failed:', err.message);
    process.exit(1);
  }
};

start();
