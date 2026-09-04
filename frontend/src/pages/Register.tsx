import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { ShieldIcon } from '../components/icons/PolicyIcons';
import Starfield from '../components/Starfield';

export default function Register() {
  const [fullName, setFullName] = useState('');
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
      const res = await authApi.post('/api/auth/register', { email, password, fullName });
      login(res.data.token, { email: res.data.email, fullName: res.data.fullName, role: res.data.role });
      navigate('/policies');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-visual">
        <div className="hero-bg-photo" style={{ backgroundImage: `url(https://images-assets.nasa.gov/image/PIA26434/PIA26434~large.jpg)` }} />
        <div className="hero-bg-scrim" />
        <Starfield density={45} />
        <ShieldIcon size={56} />
        <blockquote>
          "A claim is scored the second it's submitted — not reviewed three days later."
        </blockquote>
        <cite>— fraud-detection-service, scoring in real time over Kafka</cite>
      </div>
      <div className="auth-form-side">
        <motion.div className="auth-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1>Create your account</h1>
          <p className="sub">Set up policies and file claims in minutes.</p>
          {error && <div className="error-banner">{error}</div>}
          <form onSubmit={handleSubmit}>
            <label>
              Full name
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </label>
            <label>
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
              Password
              <input type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <button className="btn btn-brass" type="submit" disabled={loading} style={{ marginTop: '0.4rem' }}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          <div className="switch-link">
            Already registered? <Link to="/login">Sign in</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
