import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      navigate('/tasks', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <form onSubmit={onSubmit} className="card w-full max-w-md space-y-5">
        <div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to your TaskFlow workspace.</p>
        </div>
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Email</span>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">Password</span>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>
        {error && (
          <p role="alert" className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </p>
        )}
        <button className="btn-primary w-full" disabled={busy} type="submit">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="text-center text-sm text-slate-400">
          New here? <Link className="text-violet-300 hover:underline" to="/register">Create an account</Link>
        </p>
      </form>
    </main>
  );
}
