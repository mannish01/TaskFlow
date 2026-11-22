import dotenv from 'dotenv';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

for (const candidate of [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '..', '.env'),
]) {
  if (existsSync(candidate)) {
    dotenv.config({ path: candidate });
    break;
  }
}
dotenv.config();

const schema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  MONGODB_URI: z.string().min(1).default('mongodb://127.0.0.1:27017/taskflow'),
  JWT_SECRET: z.string().min(16).default('dev-only-insecure-secret-change-me'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  COOKIE_SECURE: z.enum(['true', 'false']).default('false'),
});

let cached: z.infer<typeof schema> | undefined;

export function getEnv() {
  if (!cached) cached = schema.parse(process.env);
  return cached;
}
