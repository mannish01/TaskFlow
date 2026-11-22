import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { getEnv } from '../config/env.js';
import { User, UserDoc } from '../models/User.js';
import { LoginInput, RegisterInput } from '../validators/auth.js';
import { HttpError } from '../utils/httpError.js';
import { signToken } from '../utils/token.js';

function cookieOptions() {
  const { COOKIE_SECURE } = getEnv();
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: COOKIE_SECURE === 'true',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

function publicUser(user: UserDoc) {
  return { id: user.id, name: user.name, email: user.email };
}

export async function register(input: RegisterInput, res: Response) {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw new HttpError(409, 'EMAIL_IN_USE', 'An account with that email already exists');
  }

  const password = await bcrypt.hash(input.password, 12);
  const user = await User.create({ name: input.name, email: input.email, password });
  res.cookie('token', signToken(user.id), cookieOptions());
  res.status(201).json({ success: true, data: { user: publicUser(user) } });
}

export async function login(input: LoginInput, res: Response) {
  const user = await User.findOne({ email: input.email }).select('+password');
  if (!user || !(await bcrypt.compare(input.password, user.password))) {
    throw new HttpError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect');
  }

  res.cookie('token', signToken(user.id), cookieOptions());
  res.json({ success: true, data: { user: publicUser(user) } });
}

export function logout(res: Response) {
  const { COOKIE_SECURE } = getEnv();
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: COOKIE_SECURE === 'true',
    path: '/',
  });
  res.json({ success: true, data: { message: 'Signed out' } });
}

export async function me(req: Request, res: Response) {
  if (!req.user) throw new HttpError(401, 'UNAUTHENTICATED', 'Please sign in');
  const user = await User.findById(req.user.id);
  if (!user) throw new HttpError(401, 'INVALID_TOKEN', 'Session is invalid or expired');
  res.json({ success: true, data: { user: publicUser(user) } });
}
