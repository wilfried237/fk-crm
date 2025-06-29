'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { AuthContextType } from '@/types/user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    googleLogin,
    logout,
    checkAuth,
  } = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    googleLogin,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 