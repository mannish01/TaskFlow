import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '../utils/asyncHandler.js';
import { loginSchema, registerSchema } from '../validators/auth.js';
import { login, logout, me, register } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Try again later' } },
});

router.post('/register', authLimiter, asyncHandler((req, res) => register(registerSchema.parse(req.body), res)));
router.post('/login', authLimiter, asyncHandler((req, res) => login(loginSchema.parse(req.body), res)));
router.post('/logout', asyncHandler((_req, res) => logout(res)));
router.get('/me', requireAuth, asyncHandler((req, res) => me(req, res)));

export default router;
