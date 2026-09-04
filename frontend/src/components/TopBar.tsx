import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { ShieldIcon } from './icons/PolicyIcons';

export default function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="top-bar">
      <Link to="/" className="brand logo-mark">
        <motion.span
          style={{ display: 'inline-flex' }}
          animate={{ rotate: [0, -4, 4, 0] }}
          transition={{ duration: 6, repeat: Infinity, repeatDelay: 3 }}
        >
          <ShieldIcon size={24} />
        </motion.span>
        InsureNext
      </Link>
      <nav>
        {user ? (
          <>
            <Link to="/policies">Policies</Link>
            <Link to="/claims">Claims</Link>
            <Link to="/billing">Billing</Link>
            <button onClick={handleLogout}>Sign out ({user.fullName})</button>
          </>
        ) : (
          <>
            <Link to="/login">Sign in</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
