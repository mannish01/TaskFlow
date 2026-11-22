import { Document, model, Schema, Types } from 'mongoose';

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface TaskDoc extends Document {
  user: Types.ObjectId;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<TaskDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: '', maxlength: 2000 },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'done'],
      default: 'todo',
    },
    dueDate: { type: Date, default: null },
  },
  { timestamps: true }
);

taskSchema.index({ user: 1, status: 1, dueDate: 1 });

export const Task = model<TaskDoc>('Task', taskSchema);
