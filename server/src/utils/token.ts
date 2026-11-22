import jwt from 'jsonwebtoken';
import { getEnv } from '../config/env.js';

export interface TokenPayload {
  sub: string;
}

export function signToken(userId: string): string {
  const { JWT_SECRET, JWT_EXPIRES_IN } = getEnv();
  return jwt.sign({ sub: userId } satisfies TokenPayload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyToken(token: string): TokenPayload {
  const { JWT_SECRET } = getEnv();
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
