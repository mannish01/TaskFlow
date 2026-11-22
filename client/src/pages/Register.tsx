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

  const fields = [
    { label: 'Operator name', value: name, set: setName, type: 'text', placeholder: 'Manish' },
    { label: 'Email / identifier', value: email, set: setEmail, type: 'email', placeholder: 'you@example.com' },
    { label: 'Password / key', value: password, set: setPassword, type: 'password', placeholder: '8+ characters' },
  ];

  return (
    <main className="min-h-screen">
      <div className="term-bar">
        <span>TaskFlow :: new_operator</span>
        <span className="text-acid">● ready</span>
      </div>
      <div className="mx-auto grid min-h-[calc(100vh-37px)] max-w-6xl gap-10 px-5 py-12 lg:grid-cols-2 lg:items-center lg:gap-20">
        <section>
          <p className="term-label">[ 00 / ENLIST ]</p>
          <h1 className="mt-5 text-6xl font-bold uppercase leading-[0.85] tracking-tighter sm:text-8xl">
            JOIN<span className="text-acid">_</span>QUEUE
          </h1>
          <p className="mt-8 max-w-md border-l-4 border-acid pl-4 text-sm uppercase leading-relaxed tracking-wide text-ink/70">
            Create an identity. Claim a task. Ship it. The system remembers the rest.
          </p>
        </section>

        <form onSubmit={onSubmit} className="term-panel w-full p-6 sm:p-9">
          <div className="mb-8 flex items-center justify-between border-b-2 border-ink pb-3">
            <h2 className="text-lg font-bold uppercase tracking-tight">Create identity</h2>
            <span className="term-label">id :: new</span>
          </div>
          {fields.map((field) => (
            <label className="mt-5 block first:mt-0" key={field.label}>
              <span className="term-label">{field.label}</span>
              <input
                className="input-term"
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
            <p role="alert" className="mt-6 border-2 border-rust bg-rust/10 px-3 py-2 text-xs font-bold uppercase tracking-wide text-rust">
              ! {error}
            </p>
          )}
          <button className="btn-term mt-8 w-full" disabled={busy} type="submit">
            {busy ? 'Writing…' : 'Create →'}
          </button>
          <p className="mt-6 text-xs uppercase tracking-wide text-ink/60">
            Already enlisted? <Link className="font-bold underline decoration-acid decoration-2 underline-offset-4" to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
