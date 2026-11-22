import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api.js';
import { User } from '../types.js';

interface AuthValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ user: User }>('/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      loading,
      login: async (email, password) => {
        const data = await api<{ user: User }>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        setUser(data.user);
      },
      register: async (name, email, password) => {
        const data = await api<{ user: User }>('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ name, email, password }),
        });
        setUser(data.user);
      },
      logout: async () => {
        await api('/auth/logout', { method: 'POST' });
        setUser(null);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
