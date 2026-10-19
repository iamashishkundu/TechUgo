const path = require('path');
const dotenv = require('dotenv');
const { z } = require('zod');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  APP_BASE_URL: z.string().default('http://localhost:4000'),
  CORS_ORIGIN: z.string().default('*'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_NAME: z.string().default('rbac_backend'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('postgres'),
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
  JWT_ACCESS_TTL: z.string().default('15m'),
  REFRESH_TTL_DAYS: z.coerce.number().default(7),
  TWO_FACTOR_TOKEN_TTL: z.string().default('5m'),
  TOTP_ISSUER: z.string().default('RBAC Backend'),
  ENCRYPTION_KEY: z.string().length(64, 'ENCRYPTION_KEY must be a 64-hex character string (32 bytes)'),
  BCRYPT_ROUNDS: z.coerce.number().default(12),
  SUPER_ADMIN_NAME: z.string().default('Super Admin'),
  SUPER_ADMIN_EMAIL: z.string().email().default('admin@example.com'),
  SUPER_ADMIN_PHONE: z.string().default('9999999999'),
  SUPER_ADMIN_PASSWORD: z.string().default('Admin@12345')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('Invalid environment variables:\n', JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

module.exports = parsed.data;
