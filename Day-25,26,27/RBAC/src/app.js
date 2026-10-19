const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const env = require('@config/env');
const logger = require('@config/logger');
const { globalLimiter } = require('@middlewares/rateLimiter');
const notFound = require('@middlewares/notFound');
const errorHandler = require('@middlewares/errorHandler');
const apiRouter = require('./api');

const app = express();

// Security Headers
app.use(helmet());

// CORS Configuration
app.use(
  cors({
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
    credentials: true
  })
);

// Body Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// HTTP Request Logging piped to Winston
const morganFormat = ':method :url :status :res[content-length] - :response-time ms';
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.http(message.trim())
    }
  })
);

// Global Rate Limiter
app.use(globalLimiter);

// Static uploads directory
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      uptime: process.uptime()
    }
  });
});

// API Root Router
app.use('/api', apiRouter);

// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
