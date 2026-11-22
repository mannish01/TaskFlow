import { z } from 'zod';

const optionalDueDate = z
  .union([z.string().datetime(), z.null()])
  .optional()
  .transform((value) => (value ? new Date(value) : null));

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120),
  description: z.string().trim().max(2000).optional().default(''),
  status: z.enum(['todo', 'in_progress', 'done']).optional().default('todo'),
  dueDate: optionalDueDate,
});

export const updateTaskSchema = createTaskSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: 'At least one field must be provided' }
);

export const listTasksSchema = z.object({
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  dueBefore: z.coerce.date().optional(),
  dueAfter: z.coerce.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid task id');

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ListTasksInput = z.infer<typeof listTasksSchema>;
