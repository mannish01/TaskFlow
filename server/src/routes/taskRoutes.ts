import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask,
} from '../controllers/taskController.js';
import {
  createTaskSchema,
  listTasksSchema,
  updateTaskSchema,
} from '../validators/task.js';

const router = Router();
router.use(requireAuth);

router.post('/', asyncHandler((req, res) => createTask(createTaskSchema.parse(req.body), req, res)));
router.get('/', asyncHandler((req, res) => listTasks(listTasksSchema.parse(req.query), req, res)));
router.get('/:id', asyncHandler((req, res) => getTask(req, res)));
router.patch('/:id', asyncHandler((req, res) => updateTask(updateTaskSchema.parse(req.body), req, res)));
router.delete('/:id', asyncHandler((req, res) => deleteTask(req, res)));

export default router;
