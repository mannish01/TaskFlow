import { FormEvent, useEffect, useState } from 'react';
import { TaskItem } from '../components/TaskItem.js';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../lib/api.js';
import { Task, TaskStatus } from '../types.js';

interface TaskListResponse {
  tasks: Task[];
  pagination: { total: number; page: number; pages: number };
}

const filters: Array<{ value: '' | TaskStatus; label: string }> = [
  { value: '', label: 'All' },
  { value: 'todo', label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
];

export function Tasks() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'' | TaskStatus>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const query = filter ? `?status=${filter}` : '';
      const data = await api<TaskListResponse>(`/tasks${query}`);
      setTasks(data.tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [filter]);

  const onCreate = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      const data = await api<{ task: Task }>('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        }),
      });
      setTasks((current) => [data.task, ...current]);
      setTitle('');
      setDescription('');
      setDueDate('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create task');
    }
  };

  const onToggle = async (task: Task) => {
    try {
      const data = await api<{ task: Task }>(`/tasks/${task.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: task.status }),
      });
      setTasks((current) => current.map((item) => (item.id === task.id ? data.task : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update task');
    }
  };

  const onDelete = async (id: string) => {
    try {
      await api(`/tasks/${id}`, { method: 'DELETE' });
      setTasks((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete task');
    }
  };

  return (
    <main className="min-h-screen">
      <div className="term-bar">
        <span>TaskFlow :: queue</span>
        <span className="flex items-center gap-4">
          <span className="hidden text-ink/60 sm:inline">{user?.email}</span>
          <button className="text-acid underline underline-offset-4" onClick={() => void logout()}>
            Sign out
          </button>
        </span>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-20 pt-10">
        <header className="mb-10 flex flex-col gap-4 border-b-4 border-ink pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="term-label">[ CONTROL / 001 ]</p>
            <h1 className="mt-2 text-6xl font-bold uppercase leading-[0.85] tracking-tighter sm:text-7xl">
              TASK<span className="bg-acid px-2">/</span>FLOW
            </h1>
          </div>
          <div className="text-right">
            <p className="term-label">Queue length</p>
            <p className="text-4xl font-bold leading-none">{String(tasks.length).padStart(2, '0')}</p>
          </div>
        </header>

        {error && (
          <p role="alert" className="mb-6 border-2 border-rust bg-rust/10 px-4 py-3 text-xs font-bold uppercase tracking-wide text-rust">
            ! {error}
          </p>
        )}

        <div className="grid gap-10 lg:grid-cols-[minmax(0,360px)_1fr]">
          <form onSubmit={onCreate} className="term-panel h-fit p-6">
            <div className="mb-6 flex items-center justify-between border-b-2 border-ink pb-3">
              <h2 className="text-sm font-bold uppercase tracking-widest">+ New entry</h2>
              <span className="term-label">01</span>
            </div>
            <label className="block">
              <span className="term-label">Title</span>
              <input className="input-term" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs doing?" required />
            </label>
            <label className="mt-5 block">
              <span className="term-label">Detail</span>
              <input className="input-term" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional detail" />
            </label>
            <label className="mt-5 block">
              <span className="term-label">Deadline</span>
              <input className="input-term" type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </label>
            <button className="btn-term mt-7 w-full" type="submit">Add task</button>
          </form>

          <section>
            <div className="mb-5 flex flex-wrap gap-0 border-b-2 border-ink" role="group" aria-label="Filter tasks">
              {filters.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={`border-2 border-b-0 border-ink px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-none ${
                    filter === item.value ? 'bg-acid text-ink' : 'bg-transparent text-ink hover:bg-acid/40'
                  }`}
                  aria-pressed={filter === item.value}
                  onClick={() => setFilter(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {loading ? (
              <p className="py-10 text-xs font-bold uppercase tracking-widest text-ink/50">&gt; Loading queue…</p>
            ) : tasks.length === 0 ? (
              <div className="border-2 border-dashed border-ink/40 px-6 py-16 text-center">
                <p className="text-2xl font-bold uppercase tracking-tight text-ink/40">Queue empty</p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-ink/40">&gt; Add a task to begin</p>
              </div>
            ) : (
              <ul className="border-t-2 border-ink">
                {tasks.map((task) => (
                  <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
