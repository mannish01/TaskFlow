import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(name, email, password);
      navigate('/tasks', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create account');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <form onSubmit={onSubmit} className="card w-full max-w-md space-y-5">
        <div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-slate-400">Start with one small task.</p>
        </div>
        {[
          { label: 'Name', value: name, set: setName, type: 'text', placeholder: 'Manish' },
          { label: 'Email', value: email, set: setEmail, type: 'email', placeholder: 'you@example.com' },
          { label: 'Password', value: password, set: setPassword, type: 'password', placeholder: 'At least 8 characters' },
        ].map((field) => (
          <label className="block" key={field.label}>
            <span className="mb-1 block text-xs uppercase tracking-wide text-slate-400">{field.label}</span>
            <input
              className="input"
              type={field.type}
              value={field.value}
              onChange={(e) => field.set(e.target.value)}
              placeholder={field.placeholder}
              required
              minLength={field.type === 'password' ? 8 : undefined}
            />
          </label>
        ))}
        {error && (
          <p role="alert" className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
            {error}
          </p>
        )}
        <button className="btn-primary w-full" disabled={busy} type="submit">
          {busy ? 'Creating…' : 'Create account'}
        </button>
        <p className="text-center text-sm text-slate-400">
          Already have an account? <Link className="text-violet-300 hover:underline" to="/login">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
