import cookieParser from 'cookie-parser';
import { existsSync } from 'node:fs';
import path from 'node:path';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { getEnv } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

export function createApp() {
  const env = getEnv();
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_ORIGIN,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '32kb' }));
  app.use(cookieParser());

  app.get('/api/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok' } });
  });
  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);

  app.use('/api', notFoundHandler);

  const clientDist = [
    path.resolve(process.cwd(), 'client', 'dist'),
    path.resolve(process.cwd(), '..', 'client', 'dist'),
  ].find(existsSync);
  if (clientDist) {
    app.use(express.static(clientDist));
    app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
  }

  app.use(errorHandler);
  return app;
}
