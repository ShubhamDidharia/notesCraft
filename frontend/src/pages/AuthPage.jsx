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
    <section className="page-fade" style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <form className="glass" style={{ width: '100%', maxWidth: '28rem', padding: '2rem', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={submit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>{mode === 'signin' ? 'Welcome back' : 'Create account'}</h2>
          <p style={{ color: '#5a584f' }}>Continue to your intelligent notes workspace.</p>
        </div>

        {mode === 'signup' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f1f1b', display: 'block' }}>Name</label>
            <input
              required
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Ada Lovelace"
            />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f1f1b', display: 'block' }}>Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="you@domain.com"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f1f1b', display: 'block' }}>Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            placeholder="At least 6 characters"
          />
        </div>

        {error && (
          <div className="error-box" style={{ padding: '0.75rem 1rem' }}>
            {error}
          </div>
        )}

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontWeight: '600' }} disabled={loading}>
          {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>

        <button
          type="button"
          className="btn btn-ghost"
          style={{ width: '100%', padding: '0.75rem', fontWeight: '600' }}
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
