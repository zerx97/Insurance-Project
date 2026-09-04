import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthUser {
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('insurenext_user');
    return stored ? JSON.parse(stored) : null;
  });

  function login(token: string, newUser: AuthUser) {
    // NOTE for learning: localStorage is used here for simplicity. It's readable by any
    // JS on the page, so it's vulnerable to XSS token theft. The production-grade pattern
    // is an httpOnly cookie set by the server, which JS can never read at all.
    localStorage.setItem('insurenext_token', token);
    localStorage.setItem('insurenext_user', JSON.stringify(newUser));
    setUser(newUser);
  }

  function logout() {
    localStorage.removeItem('insurenext_token');
    localStorage.removeItem('insurenext_user');
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
