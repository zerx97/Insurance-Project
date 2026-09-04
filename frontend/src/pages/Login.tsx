import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ShieldIcon } from '../components/icons/PolicyIcons';
import Starfield from '../components/Starfield';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.post('/api/auth/login', { email, password });
      login(res.data.token, { email: res.data.email, fullName: res.data.fullName, role: res.data.role });
      navigate('/policies');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Sign in failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-visual">
        <div className="hero-bg-photo" style={{ backgroundImage: `url(https://apod.nasa.gov/apod/image/2609/noirlab2621a_1024.jpg)` }} />
        <div className="hero-bg-scrim" />
        <Starfield density={45} />
        <ShieldIcon size={56} />
        <blockquote>
          "Every policy issued publishes an event. Nothing waits on a human to notice it."
        </blockquote>
        <cite>— how billing-service gets your first invoice out instantly</cite>
      </div>
      <div className="auth-form-side">
        <motion.div className="auth-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1>Sign in</h1>
          <p className="sub">Access your policies, claims, and billing.</p>
          {error && <div className="error-banner">{error}</div>}
          <form onSubmit={handleSubmit}>
            <label>
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <button className="btn btn-brass" type="submit" disabled={loading} style={{ marginTop: '0.4rem' }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <div className="switch-link">
            No account yet? <Link to="/register">Register here</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
