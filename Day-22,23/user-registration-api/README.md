# User Registration API

REST API for user registration, login, profile management, and admin user management.
Everything lives under two modules, `src/v1/user` and `src/v1/admin`, each organised in layers
(routes → controllers → services → models).

## Stack
Node.js, Express 5, MySQL (mysql2/promise), Zod 3, jsonwebtoken, bcryptjs, dotenv (CommonJS).

## Setup
```bash
npm install
cp .env.example .env        # then fill in real values (use a long random JWT_SECRET)
mysql -u root -p < schema.sql
npm run dev
```
On Windows, use `copy .env.example .env` instead of `cp`.

Create the first admin (registration can only create normal users): set `ADMIN_NAME`,
`ADMIN_EMAIL`, `ADMIN_PASSWORD` in `.env`, run `npm run seed:admin`, then remove `ADMIN_PASSWORD`.

## Scripts
| Command | What it does |
|---|---|
| `npm run dev` | Start with nodemon |
| `npm start` | Start with node |
| `npm run seed:admin` | Create the first admin from the `ADMIN_*` env vars |
| `npm run test:e2e` | End-to-end test (server must be running) |

Layer test scripts (no server needed): `node scripts/test-db.js`, `test-utils.js`, `test-validators.js`,
`test-model.js`, `test-services.js`, `test-controllers.js`, `test-errors.js`.

## Project structure
```
src/
├── app.js                         builds the Express app
├── server.js                      DB check, then listen
└── v1/
    ├── index.js                   mounts /auth, /users, /admin/users
    ├── user/                      registration, login, own profile (+ the building blocks admin reuses)
    │   ├── config/                db pool
    │   ├── utils/                 AppError, password, jwt
    │   ├── middlewares/           authenticate, validate, notFound + errorHandler
    │   ├── models/                user.model.js (SQL only: no role changes, no delete)
    │   ├── validators/            fields, id, auth, user (Zod, .strict())
    │   ├── services/              auth.service, user.service (business rules)
    │   ├── controllers/           auth.controller, user.controller (req/res only)
    │   └── routes/                auth.routes, user.routes (wiring only)
    └── admin/                     admin-only user management
        ├── middlewares/           authorize (role check)
        ├── models/                admin.model.js (SQL only: list, role changes, delete)
        ├── validators/            admin.validator
        ├── services/              admin.service
        ├── controllers/           admin.controller
        ├── routes/                admin.routes
        └── seed-admin.js          first-admin seed script
scripts/                           layer test scripts + e2e
schema.sql
```
Each module owns its own model, so the user module has no code path that can change a role or delete
a row. The admin module reuses only infrastructure from `user/` (DB pool, `AppError`, password/jwt
utils, auth and validate middlewares, field rules), so there is one `AppError` class and one pool.

## Endpoints
| Method | Path | Access | Description |
|---|---|---|---|
| GET | /health | public | Liveness check |
| POST | /api/v1/auth/register | public | Create a user (role is always `user`) |
| POST | /api/v1/auth/login | public | Returns `{ token, user }` |
| GET | /api/v1/users/me | token | Own profile |
| PATCH | /api/v1/users/me | token | Update own name, email, or password |
| GET | /api/v1/admin/users | admin | List users |
| GET | /api/v1/admin/users/:id | admin | Get one user |
| PATCH | /api/v1/admin/users/:id | admin | Update user (can change role) |
| DELETE | /api/v1/admin/users/:id | admin | Delete user (not yourself) |

Send the token as `Authorization: Bearer <token>`.

## Response format
Success: `{ "success": true, "data": ... }` (DELETE returns 204, no body).
Error: `{ "success": false, "message": "...", "details": [...] }` (`details` only for validation errors).

| Status | Meaning |
|---|---|
| 400 | Validation failed or bad JSON |
| 401 | Missing, invalid, or expired token / bad credentials |
| 403 | Authenticated but not allowed |
| 404 | Not found |
| 409 | Email already in use |
| 413 | Body too large |
| 500 | Unexpected error (details logged server-side only) |

## Security notes
Passwords hashed with bcrypt and never returned; parameterized SQL with a column whitelist for updates;
`.strict()` schemas, a server-set role, and a user model with no role column in its update whitelist block mass assignment; JWT algorithm pinned to HS256;
identical 401 for unknown email and wrong password; admin cannot delete themselves; internals never
leaked on 500; body size capped; secrets in `.env` (gitignored).

Known gaps: no rate limiting on login/register, no `helmet`/CORS, roles live in the token until it
expires (keep `JWT_EXPIRES_IN` short), the duplicate-key handler assumes `email` is the only unique
column, and the API should run behind HTTPS in production.
