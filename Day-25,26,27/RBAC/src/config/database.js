const env = require('./env');

const config = {
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: 'postgres',
  logging: env.NODE_ENV === 'development' ? false : false,
  define: {
    underscored: true,
    timestamps: true
  },
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

module.exports = {
  development: config,
  test: {
    ...config,
    database: `${env.DB_NAME}_test`
  },
  production: {
    ...config,
    logging: false
  }
};
