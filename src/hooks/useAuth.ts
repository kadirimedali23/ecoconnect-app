import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

  // This one throws if called outside <AuthProvider>, preventing silent auth failures across the app.

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}