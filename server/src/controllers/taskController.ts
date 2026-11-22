import { Request, Response } from 'express';
import { Task, TaskDoc } from '../models/Task.js';
import {
  CreateTaskInput,
  ListTasksInput,
  UpdateTaskInput,
  objectIdSchema,
} from '../validators/task.js';
import { HttpError } from '../utils/httpError.js';

function userId(req: Request): string {
  if (!req.user) throw new HttpError(401, 'UNAUTHENTICATED', 'Please sign in');
  return req.user.id;
}

function taskId(req: Request): string {
  return objectIdSchema.parse(req.params.id);
}

function toDTO(task: TaskDoc) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

export async function createTask(input: CreateTaskInput, req: Request, res: Response) {
  const task = await Task.create({ ...input, user: userId(req) });
  res.status(201).json({ success: true, data: { task: toDTO(task) } });
}

export async function listTasks(query: ListTasksInput, req: Request, res: Response) {
  const filter: Record<string, unknown> = { user: userId(req) };
  if (query.status) filter.status = query.status;
  if (query.dueBefore) filter.dueDate = { ...(filter.dueDate as object), $lte: query.dueBefore };
  if (query.dueAfter) {
    const existing = (filter.dueDate as Record<string, unknown>) ?? {};
    filter.dueDate = { ...existing, $gte: query.dueAfter };
  }

  const total = await Task.countDocuments(filter);
  const tasks = await Task.find(filter)
    .sort({ createdAt: -1 })
    .skip((query.page - 1) * query.limit)
    .limit(query.limit);

  res.json({
    success: true,
    data: {
      tasks: tasks.map(toDTO),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.max(1, Math.ceil(total / query.limit)),
      },
    },
  });
}

export async function getTask(req: Request, res: Response) {
  const task = await Task.findOne({ _id: taskId(req), user: userId(req) });
  if (!task) throw new HttpError(404, 'TASK_NOT_FOUND', 'Task not found');
  res.json({ success: true, data: { task: toDTO(task) } });
}

export async function updateTask(input: UpdateTaskInput, req: Request, res: Response) {
  const task = await Task.findOne({ _id: taskId(req), user: userId(req) });
  if (!task) throw new HttpError(404, 'TASK_NOT_FOUND', 'Task not found');

  Object.assign(task, input);
  await task.save();
  res.json({ success: true, data: { task: toDTO(task) } });
}

export async function deleteTask(req: Request, res: Response) {
  const task = await Task.findOneAndDelete({ _id: taskId(req), user: userId(req) });
  if (!task) throw new HttpError(404, 'TASK_NOT_FOUND', 'Task not found');
  res.status(204).send();
}
