import { useEffect, useState, ReactNode } from 'react';
import { getCurrentAuthUser, logout, type AuthUser } from '../services/authService';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const u = await getCurrentAuthUser();
    setUser(u);
  };

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  const signOut = async () => {
    await logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}