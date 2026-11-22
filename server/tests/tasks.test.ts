import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

async function signedInAgent(email: string) {
  const agent = request.agent(app);
  await agent
    .post('/api/auth/register')
    .send({ name: 'Test User', email, password: 'password123' })
    .expect(201);
  return agent;
}

describe('tasks', () => {
  it('creates, lists, updates and deletes a task for the signed-in user', async () => {
    const agent = await signedInAgent('owner@example.com');

    const created = await agent
      .post('/api/tasks')
      .send({
        title: 'Ship TaskFlow',
        description: 'Finish the CRUD slice',
        status: 'in_progress',
        dueDate: '2026-12-01T10:00:00.000Z',
      })
      .expect(201);

    expect(created.body.data.task.title).toBe('Ship TaskFlow');
    const id = created.body.data.task.id as string;

    const listed = await agent.get('/api/tasks').expect(200);
    expect(listed.body.data.tasks).toHaveLength(1);
    expect(listed.body.data.pagination.total).toBe(1);

    const updated = await agent
      .patch(`/api/tasks/${id}`)
      .send({ status: 'done' })
      .expect(200);
    expect(updated.body.data.task.status).toBe('done');

    await agent.delete(`/api/tasks/${id}`).expect(204);
    const empty = await agent.get('/api/tasks').expect(200);
    expect(empty.body.data.tasks).toHaveLength(0);
  });

  it('does not let another user read or modify a task', async () => {
    const owner = await signedInAgent('owner@example.com');
    const other = await signedInAgent('other@example.com');

    const created = await owner
      .post('/api/tasks')
      .send({ title: 'Private task' })
      .expect(201);
    const id = created.body.data.task.id as string;

    await other.get(`/api/tasks/${id}`).expect(404);
    await other.patch(`/api/tasks/${id}`).send({ title: 'Hacked' }).expect(404);
    await other.delete(`/api/tasks/${id}`).expect(404);

    const otherList = await other.get('/api/tasks').expect(200);
    expect(otherList.body.data.tasks).toHaveLength(0);
  });

  it('filters by status and validates input', async () => {
    const agent = await signedInAgent('filter@example.com');
    await agent.post('/api/tasks').send({ title: 'Todo task' }).expect(201);
    await agent
      .post('/api/tasks')
      .send({ title: 'Done task', status: 'done' })
      .expect(201);

    const done = await agent.get('/api/tasks?status=done').expect(200);
    expect(done.body.data.tasks).toHaveLength(1);
    expect(done.body.data.tasks[0].title).toBe('Done task');

    const invalid = await agent.post('/api/tasks').send({}).expect(400);
    expect(invalid.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('keeps an omitted due date as null instead of coercing it to 1970', async () => {
    const agent = await signedInAgent('dates@example.com');
    const created = await agent
      .post('/api/tasks')
      .send({ title: 'No deadline', dueDate: null })
      .expect(201);

    expect(created.body.data.task.dueDate).toBeNull();
  });

  it('rejects unauthenticated task access', async () => {
    await request(app).get('/api/tasks').expect(401);
  });
});
