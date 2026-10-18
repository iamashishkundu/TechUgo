const assert = require('assert');
const express = require('express');
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const AppError = require('../src/v1/user/utils/AppError');
const { notFound, errorHandler } = require('../src/v1/user/middlewares/error.middleware');

const app = express();
app.use(express.json({ limit: '10kb' }));
app.get('/app-error', () => { throw new AppError('Teapot', 418); });
app.get('/zod', () => { z.object({ a: z.string() }).strict().parse({ b: 1 }); });
app.get('/jwt-expired', () => {
  const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) - 10 }, 's');
  jwt.verify(token, 's');
});
app.get('/jwt-bad', () => { jwt.verify('garbage', 's'); });
app.get('/dup', () => { throw Object.assign(new Error('dup'), { code: 'ER_DUP_ENTRY' }); });
app.get('/boom', () => { throw new Error('secret internal detail'); });
app.post('/echo', (req, res) => res.json(req.body));
app.use(notFound);
app.use(errorHandler);

(async () => {
  const server = app.listen(0);
  const base = `http://localhost:${server.address().port}`;
  const call = async (path, options) => {
    const res = await fetch(base + path, options);
    return { status: res.status, body: await res.json() };
  };

  try {
    let r = await call('/app-error');
    assert(r.status === 418 && r.body.message === 'Teapot');

    r = await call('/zod');
    assert(r.status === 400 && Array.isArray(r.body.details));

    assert((await call('/jwt-expired')).status === 401);
    assert((await call('/jwt-bad')).status === 401);
    assert((await call('/dup')).status === 409);
    assert((await call('/nope')).status === 404);

    const realError = console.error;
    console.error = () => {}; // silence the expected server-side log
    r = await call('/boom');
    console.error = realError;
    assert(r.status === 500 && r.body.message === 'Internal server error');
    assert(!JSON.stringify(r.body).includes('secret'), 'must not leak internals');

    r = await call('/echo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{bad json',
    });
    assert(r.status === 400);

    console.log('error middleware OK');
  } catch (err) {
    console.error('FAILED:', err.message);
    process.exitCode = 1;
  } finally {
    server.close();
  }
})();
