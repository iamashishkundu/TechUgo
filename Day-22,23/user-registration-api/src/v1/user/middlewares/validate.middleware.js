// Usage: validate({ body: schema, params: schema, query: schema })
// Any part can be omitted. On failure, parse() throws a ZodError, which
// Express 5 forwards to the error middleware automatically.
const validate = (schemas) => (req, res, next) => {
  req.validated = {};

  if (schemas.body) req.body = schemas.body.parse(req.body ?? {});
  // req.query is read-only in Express 5, so params and query go on req.validated
  if (schemas.params) req.validated.params = schemas.params.parse(req.params);
  if (schemas.query) req.validated.query = schemas.query.parse(req.query);

  next();
};

module.exports = validate;
