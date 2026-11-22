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
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">TaskFlow</h1>
          <p className="text-sm text-slate-400">Signed in as {user?.email}</p>
        </div>
        <button className="btn-ghost" onClick={() => void logout()}>Sign out</button>
      </header>

      <form onSubmit={onCreate} className="card mb-8 space-y-4">
        <h2 className="font-semibold">Add a task</h2>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs doing?" required />
        <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional detail" />
        <input className="input" type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button className="btn-primary" type="submit">Add task</button>
      </form>

      <div className="mb-4 flex gap-2" role="group" aria-label="Filter tasks">
        {filters.map((item) => (
          <button
            key={item.label}
            type="button"
            className={filter === item.value ? 'btn-primary' : 'btn-ghost'}
            aria-pressed={filter === item.value}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="mb-4 rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}
      {loading ? (
        <p className="text-slate-400">Loading tasks…</p>
      ) : tasks.length === 0 ? (
        <p className="text-slate-400">No tasks yet. Add one above.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </main>
  );
}
