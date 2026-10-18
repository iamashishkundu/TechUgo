const express = require('express');
const v1Routes = require('./v1');
const { notFound, errorHandler } = require('./v1/user/middlewares/error.middleware');

const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));

// Simple liveness check. No business logic, so it stays inline.
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/v1', v1Routes);

app.use(notFound);
app.use(errorHandler); // must be last

module.exports = app;
