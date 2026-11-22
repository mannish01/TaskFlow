import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { getEnv } from './config/env.js';

async function main() {
  const env = getEnv();
  await connectDB();
  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`TaskFlow API listening on http://localhost:${env.PORT}`);
  });
}

main().catch((error) => {
  console.error('Failed to start TaskFlow API', error);
  process.exit(1);
});
