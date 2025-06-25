'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/sign-in');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return fallback || (
      <Loading
        fullScreen
        text="Checking authentication..."
        subtitle="Please wait while we verify your login status"
        color="blue"
      />
    );
  }

  // Show children only if authenticated
  if (!isAuthenticated) {
    return (
      <Loading
        fullScreen
        text="Access denied"
        subtitle="Redirecting to sign in..."
        color="gray"
      />
    );
  }

  return <>{children}</>;
} 