import { Routes, Route } from 'react-router-dom';
import type { ReactNode } from 'react';
import TopBar from './components/TopBar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Policies from './pages/Policies';
import Claims from './pages/Claims';
import Billing from './pages/Billing';

function PageWrap({ children }: { children: ReactNode }) {
  return <div className="page-wrap">{children}</div>;
}

export default function App() {
  return (
    <div className="app-shell">
      <TopBar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/policies" element={<ProtectedRoute><PageWrap><Policies /></PageWrap></ProtectedRoute>} />
          <Route path="/claims" element={<ProtectedRoute><PageWrap><Claims /></PageWrap></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute><PageWrap><Billing /></PageWrap></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}
