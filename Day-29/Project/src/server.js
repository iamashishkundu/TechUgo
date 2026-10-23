import app from './app.js';
import { env } from './config/env.js';
import { testDbConnection, sequelize } from './config/database.js';
import { syncDatabase } from './database/associations.js';

let server;

/**
 * Main application bootstrap function with comprehensive try/catch
 */
async function startServer() {
  console.log('[Server]: Bootstrapping E-Commerce Checkout Engine...');

  try {
    // 1. Verify PostgreSQL Database Connectivity
    const isConnected = await testDbConnection();
    if (!isConnected) {
      throw new Error('Database connection failed. Please check PostgreSQL credentials in .env.');
    }

    // 2. Synchronize Database Models & Relational Constraints
    await syncDatabase({ alter: true });

    // 3. Start Express HTTP Server
    server = app.listen(env.PORT, () => {
      console.log(`\n=============================================================`);
      console.log(`🚀 Checkout Engine running on port: ${env.PORT}`);
      console.log(`🌍 Environment: ${env.NODE_ENV}`);
      console.log(`📍 Base URLs:`);
      console.log(`   - POST http://localhost:${env.PORT}/api/v1/checkout`);
      console.log(`   - GET  http://localhost:${env.PORT}/api/v1/orders/:id`);
      console.log(`   - POST http://localhost:${env.PORT}/api/v1/orders/:id/cancel`);
      console.log(`   - GET  http://localhost:${env.PORT}/api/v1/products`);
      console.log(`   - GET  http://localhost:${env.PORT}/api/v1/users`);
      console.log(`=============================================================\n`);
    });
  } catch (error) {
    console.error('\n[Server Startup Fatal Error]:');
    console.error(error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
}

/**
 * Graceful Shutdown Handler
 */
async function gracefulShutdown(signal) {
  console.log(`\n[Server]: Received ${signal}. Closing gracefully...`);

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) return reject(err);
          console.log('[Server]: HTTP server closed.');
          resolve();
        });
      });
    }

    await sequelize.close();
    console.log('[Server]: Database connection pool closed.');
    process.exit(0);
  } catch (error) {
    console.error('[Server]: Error during shutdown:', error.message);
    process.exit(1);
  }
}

// Listen for termination signals
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Catch unhandled errors
process.on('unhandledRejection', (reason) => {
  console.error('[Unhandled Rejection]:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[Uncaught Exception]:', err);
  process.exit(1);
});

// Start the server
startServer();
