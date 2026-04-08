import { createContext } from 'react';
import type { AuthUser } from '../lib/auth';

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);