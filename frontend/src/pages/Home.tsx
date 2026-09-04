import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <>
      <h1 className="page-title">InsureNext</h1>
      <p className="page-subtitle">
        A production-grade insurance platform, built as a learning reference — policy issuance,
        claims intake, fraud scoring, and billing, wired together with real events, not mocks.
      </p>
      {!user && (
        <p>
          <Link to="/register">Create an account</Link> or <Link to="/login">sign in</Link> to get started.
        </p>
      )}
    </>
  );
}
