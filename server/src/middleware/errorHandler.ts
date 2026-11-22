import { ErrorRequestHandler, RequestHandler } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { getEnv } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';

export const notFoundHandler: RequestHandler = (_req, _res, next) => {
  next(new HttpError(404, 'NOT_FOUND', 'Route not found'));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      success: false,
      error: { code: err.code, message: err.message, details: err.details },
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'The request is invalid',
        details: err.flatten(),
      },
    });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      error: { code: 'INVALID_ID', message: 'The supplied id is invalid' },
    });
    return;
  }

  if ((err as { code?: number }).code === 11000) {
    res.status(409).json({
      success: false,
      error: { code: 'DUPLICATE', message: 'That value is already in use' },
    });
    return;
  }

  if (getEnv().NODE_ENV !== 'test') console.error(err);
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' },
  });
};
