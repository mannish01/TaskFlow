import { Task } from '../types.js';

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
}

const statusLabel: Record<Task['status'], string> = {
  todo: 'To do',
  in_progress: 'In progress',
  done: 'Done',
};

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const nextStatus = task.status === 'done' ? 'todo' : 'done';

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3
            className={`truncate font-semibold ${task.status === 'done' ? 'text-slate-500 line-through' : 'text-white'}`}
          >
            {task.title}
          </h3>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-slate-300">
            {statusLabel[task.status]}
          </span>
        </div>
        {task.description && (
          <p className="mt-1 text-sm text-slate-400">{task.description}</p>
        )}
        {task.dueDate && (
          <p className="mt-1 text-xs text-slate-500">
            Due {new Date(task.dueDate).toLocaleDateString()}
          </p>
        )}
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => onToggle({ ...task, status: nextStatus })}
        >
          {task.status === 'done' ? 'Reopen' : 'Complete'}
        </button>
        <button
          type="button"
          className="btn-ghost text-rose-300 hover:bg-rose-500/10"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
