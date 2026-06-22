import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authAPI.login({ email, password });
      login(res.data.token, res.data.user);
      navigate('/requests');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '420px', marginTop: '4rem' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎫</h1>
          <h2 style={{ marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ color: '#6b7280' }}>Sign in to manage your tickets</p>
        </div>

        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>📧 Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label>🔒 Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem' }}>
            {loading ? '⏳ Signing in...' : '✓ Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ marginBottom: '0.5rem', color: '#6b7280' }}>
            Don't have an account?
          </p>
          <Link to="/register" style={{ fontWeight: 600 }}>
            Create one now →
          </Link>
        </div>

        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '6px', fontSize: '0.85rem', color: '#0c4a6e' }}>
          <strong>Demo credentials:</strong><br/>
          Email: admin@example.com<br/>
          Password: admin123
        </div>
      </div>
    </div>
  );
}
