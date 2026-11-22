import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: MongoMemoryServer | undefined;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret-long-enough-for-jwt-signing';
  process.env.COOKIE_SECURE = 'false';
  process.env.CLIENT_ORIGIN = 'http://localhost:5173';
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const collection of Object.values(collections)) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});
