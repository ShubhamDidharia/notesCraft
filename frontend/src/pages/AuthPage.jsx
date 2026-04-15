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
    <section className="auth page-fade">
      <form className="auth-card glass" onSubmit={submit}>
        <h2>{mode === 'signin' ? 'Welcome back' : 'Create account'}</h2>
        <p>Continue to your intelligent notes workspace.</p>

        {mode === 'signup' && (
          <label>
            Name
            <input
              required
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Ada Lovelace"
            />
          </label>
        )}

        <label>
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="you@domain.com"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            placeholder="At least 6 characters"
          />
        </label>

        {error && <div className="error-box">{error}</div>}

        <button type="submit" className="btn solid full" disabled={loading}>
          {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>

        <button
          type="button"
          className="btn ghost full"
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
