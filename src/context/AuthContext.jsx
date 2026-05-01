import { createContext, useContext, useMemo } from 'react';

const AuthContext = createContext(null);

// Mock user — no Firebase, no login required
const MOCK_USER = { uid: 'local-user', displayName: 'You', email: 'local@planner.app' };

export function AuthProvider({ children }) {
  const value = useMemo(
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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
