import { RequestHandler } from 'express';

export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    try {
      Promise.resolve(fn(req, res, next)).catch(next);
    } catch (error) {
      next(error);
    }
  };
