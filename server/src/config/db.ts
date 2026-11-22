import mongoose from 'mongoose';
import { getEnv } from './env.js';

export async function connectDB(): Promise<void> {
  const { MONGODB_URI } = getEnv();
  mongoose.set('strictQuery', true);
  await mongoose.connect(MONGODB_URI);
}

export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
