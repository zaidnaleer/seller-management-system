import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const authResponse = await loginUser(email, password);
      login(authResponse);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-manifest">
        <span className="auth-manifest-eyebrow">Seller Registry — Manifest 07</span>
        <h1 className="auth-manifest-title">Every seller, one verified ledger.</h1>
        <p className="auth-manifest-sub">
          Register businesses, track verification status, and manage your marketplace
          seller base from a single control point.
        </p>
        <div className="auth-manifest-ledger">
          <div><strong>GST</strong>Verified onboarding</div>
          <div><strong>JWT</strong>Secured sessions</div>
          <div><strong>24/7</strong>Live seller status</div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-card">
          <h2>Sign in</h2>
          <p className="auth-card-sub">Access your seller management console.</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="auth-switch">
            New seller account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}