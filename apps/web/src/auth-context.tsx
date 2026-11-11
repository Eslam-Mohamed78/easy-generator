import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, AuthResponse } from './api';

interface AuthState {
  user: AuthResponse['user'] | null;
  token: string | null;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<AuthResponse['user'] | null>(() => {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as AuthResponse['user']) : null;
  });

  useEffect(() => {
    if (token && !user) {
      api
        .me()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const applyAuth = (res: AuthResponse) => {
    localStorage.setItem('token', res.accessToken);
    localStorage.setItem('user', JSON.stringify(res.user));
    setToken(res.accessToken);
    setUser(res.user);
  };

  const value: AuthState = {
    user,
    token,
    signin: async (email, password) => applyAuth(await api.signin({ email, password })),
    signup: async (email, name, password) => applyAuth(await api.signup({ email, name, password })),
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
