import { createContext } from 'react';
import type { AuthUser } from '../services/authService';

//  This here defines the auth data shared across the app then consumed by useAuth() in any component.

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);