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
    <main className="min-h-screen">
      <div className="term-bar">
        <span>TaskFlow :: auth_gate</span>
        <span className="text-acid">● ready</span>
      </div>
      <div className="mx-auto grid min-h-[calc(100vh-37px)] max-w-6xl gap-10 px-5 py-12 lg:grid-cols-2 lg:items-center lg:gap-20">
        <section>
          <p className="term-label">[ 01 / ACCESS ]</p>
          <h1 className="mt-5 text-6xl font-bold uppercase leading-[0.85] tracking-tighter sm:text-8xl">
            TASK<span className="text-acid">/</span>FLOW
          </h1>
          <p className="mt-8 max-w-md border-l-4 border-acid pl-4 text-sm uppercase leading-relaxed tracking-wide text-ink/70">
            No noise. No dashboards full of charts. One queue, one job at a time.
          </p>
          <p className="mt-10 text-[10px] font-bold uppercase tracking-[0.25em] text-ink/45">
            Build :: Ship :: Repeat
          </p>
        </section>

        <form onSubmit={onSubmit} className="term-panel w-full p-6 sm:p-9">
          <div className="mb-8 flex items-center justify-between border-b-2 border-ink pb-3">
            <h2 className="text-lg font-bold uppercase tracking-tight">Sign in</h2>
            <span className="term-label">id :: 001</span>
          </div>
          <label className="block">
            <span className="term-label">Email / identifier</span>
            <input
              className="input-term"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="mt-6 block">
            <span className="term-label">Password / key</span>
            <input
              className="input-term"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8+ characters"
              required
            />
          </label>
          {error && (
            <p role="alert" className="mt-6 border-2 border-rust bg-rust/10 px-3 py-2 text-xs font-bold uppercase tracking-wide text-rust">
              ! {error}
            </p>
          )}
          <button className="btn-term mt-8 w-full" disabled={busy} type="submit">
            {busy ? 'Verifying…' : 'Enter →'}
          </button>
          <p className="mt-6 text-xs uppercase tracking-wide text-ink/60">
            New operator? <Link className="font-bold underline decoration-acid decoration-2 underline-offset-4" to="/register">Create identity</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
