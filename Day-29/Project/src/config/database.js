import { Sequelize } from 'sequelize';
import { env } from './env.js';

/**
 * Sequelize PostgreSQL Client Instance
 */
export const sequelize = new Sequelize(
  env.DB.NAME,
  env.DB.USER,
  env.DB.PASSWORD,
  {
    host: env.DB.HOST,
    port: env.DB.PORT,
    dialect: 'postgres',
    logging: process.env.DB_LOGGING === 'true' ? (msg) => console.log(`[SQL]: ${msg}`) : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true, // snake_case for DB columns (created_at, updated_at)
    },
  }
);

/**
 * Validates database connectivity with try/catch error handling
 */
export async function testDbConnection() {
  try {
    await sequelize.authenticate();
    console.log(`[Database]: Connection to PostgreSQL (${env.DB.NAME} on ${env.DB.HOST}:${env.DB.PORT}) established successfully.`);
    return true;
  } catch (error) {
    console.error('[Database Error]: Unable to connect to the PostgreSQL database.');
    console.error(`Reason: ${error.message}`);
    if (error.original) {
      console.error(`DB Code: ${error.original.code} | Routine: ${error.original.routine}`);
    }
    return false;
  }
}
