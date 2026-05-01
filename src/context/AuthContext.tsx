import { createContext, useContext, useMemo, type ReactNode } from 'react';

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

interface AuthContextValue {
  user: User;
  loading: boolean;
  error: Error | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Mock user — no Firebase, no login required
const MOCK_USER: User = {
  uid: 'local-user',
  displayName: 'You',
  email: 'local@planner.app',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useMemo<AuthContextValue>(
    () => ({
      user: MOCK_USER,
      loading: false,
      error: null,
      signInWithGoogle: async () => {},
      signOut: async () => {},
    }),
    []
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
