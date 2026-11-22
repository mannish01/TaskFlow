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
  const done = task.status === 'done';

  return (
    <li className="flex flex-col gap-4 border-b-2 border-ink py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        <span
          aria-hidden="true"
          className={`mt-1 text-2xl font-bold leading-none ${done ? 'text-ink' : 'text-ink/25'}`}
        >
          {done ? '[x]' : '[ ]'}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h3
              className={`truncate text-base font-bold uppercase tracking-tight ${done ? 'text-ink/40 line-through decoration-2' : 'text-ink'}`}
            >
              {task.title}
            </h3>
            <span className={`tag ${done ? 'bg-acid' : 'bg-transparent'}`}>
              {statusLabel[task.status]}
            </span>
          </div>
          {task.description && (
            <p className="mt-2 text-xs uppercase tracking-wide text-ink/55">{task.description}</p>
          )}
          {task.dueDate && (
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-ink/45">
              Due :: {new Date(task.dueDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          className="btn-term-ghost"
          onClick={() => onToggle({ ...task, status: nextStatus })}
        >
          {done ? 'Reopen' : 'Complete'}
        </button>
        <button
          type="button"
          className="btn-term-ghost border-rust text-rust hover:bg-rust hover:text-paper"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
