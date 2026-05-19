import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { isAuthenticated, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/notes" replace />;
  }

  const from = location.state?.from?.pathname || '/notes';

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        await signUp(form);
      } else {
        await signIn({ email: form.email, password: form.password });
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-fade grid place-items-center min-h-screen">
      <form className="glass w-full max-w-lg p-8 rounded-3xl space-y-6" onSubmit={submit}>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">{mode === 'signin' ? 'Welcome back' : 'Create account'}</h2>
          <p className="text-muted-foreground">Continue to your intelligent notes workspace.</p>
        </div>

        {mode === 'signup' && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground">Name</label>
            <input
              required
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Ada Lovelace"
              className="w-full border border-border rounded-lg px-4 py-3 text-foreground bg-input placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="you@domain.com"
            className="w-full border border-border rounded-lg px-4 py-3 text-foreground bg-input placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-foreground">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            placeholder="At least 6 characters"
            className="w-full border border-border rounded-lg px-4 py-3 text-foreground bg-input placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          />
        </div>

        {error && (
          <div className="error-box border border-destructive/30 bg-destructive/10 text-destructive rounded-lg p-3">
            {error}
          </div>
        )}

        <button type="submit" className="w-full btn btn-primary py-3 font-semibold" disabled={loading}>
          {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>

        <button
          type="button"
          className="w-full btn btn-ghost py-3 font-semibold"
          onClick={() => {
            setError('');
            setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
          }}
        >
          {mode === 'signin' ? 'Need an account? Sign up' : 'Already registered? Sign in'}
        </button>
      </form>
    </section>
  );
};

export default AuthPage;
