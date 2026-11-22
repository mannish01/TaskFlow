import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/httpError.js';
import { verifyToken } from '../utils/token.js';

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (!token || typeof token !== 'string') {
    return next(new HttpError(401, 'UNAUTHENTICATED', 'Please sign in'));
  }
  try {
    const payload = verifyToken(token);
    if (!payload.sub) throw new Error('Missing subject');
    req.user = { id: payload.sub, email: '' };
    next();
  } catch {
    next(new HttpError(401, 'INVALID_TOKEN', 'Session is invalid or expired'));
  }
}
