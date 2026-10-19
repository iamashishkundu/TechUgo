require('module-alias/register');

const http = require('http');
const env = require('@config/env');
const logger = require('@config/logger');
const { sequelize } = require('@db');
const app = require('./app');

const server = http.createServer(app);

async function startServer() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully');

    server.listen(env.PORT, () => {
      logger.info('Server running on port %d in %s mode', env.PORT, env.NODE_ENV);
    });
  } catch (err) {
    logger.error('Failed to start server: %s', err.message);
    process.exit(1);
  }
}

// Graceful shutdown handling
function handleShutdown(signal) {
  logger.info('Received %s. Shutting down gracefully...', signal);
  server.close(async () => {
    logger.info('HTTP server closed');
    try {
      await sequelize.close();
      logger.info('Database connection closed');
      process.exit(0);
    } catch (err) {
      logger.error('Error closing database connection: %s', err.message);
      process.exit(1);
    }
  });

  // Force close after 10s
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

startServer();
