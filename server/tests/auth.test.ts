import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('auth', () => {
  it('registers, keeps the session across a me call, and logs out', async () => {
    const agent = request.agent(app);

    const registered = await agent
      .post('/api/auth/register')
      .send({ name: 'Manish', email: 'manish@example.com', password: 'password123' })
      .expect(201);

    expect(registered.body.success).toBe(true);
    expect(registered.body.data.user.email).toBe('manish@example.com');
    expect(registered.body.data.user.password).toBeUndefined();

    const me = await agent.get('/api/auth/me').expect(200);
    expect(me.body.data.user.email).toBe('manish@example.com');

    await agent.post('/api/auth/logout').expect(200);
    await agent.get('/api/auth/me').expect(401);
  });

  it('rejects bad credentials with a consistent error shape', async () => {
    const agent = request.agent(app);
    await agent
      .post('/api/auth/register')
      .send({ name: 'Manish', email: 'manish@example.com', password: 'password123' })
      .expect(201);

    const response = await agent
      .post('/api/auth/login')
      .send({ email: 'manish@example.com', password: 'wrong-password' })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    expect(response.body.error.message).toBeTruthy();
  });

  it('rejects invalid registration input with VALIDATION_ERROR', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ name: 'M', email: 'not-an-email', password: 'short' })
      .expect(400);

    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.details.fieldErrors).toBeTruthy();
  });
});
