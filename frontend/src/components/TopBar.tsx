import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="top-bar">
      <Link to="/" className="brand">InsureNext</Link>
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
