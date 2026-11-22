export interface User {
  id: string;
  name: string;
  email: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiErrorBody {
  code: string;
  message: string;
}
