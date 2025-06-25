'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/loading';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're not loading and user is authenticated AND email is verified
    if (!isLoading && isAuthenticated && user && user.emailVerified) {
      // Email is verified, redirect to dashboard
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Show loading during initial auth check
  if (isLoading) {
    return (
      <Loading
        fullScreen
        text="Loading..."
        subtitle="Checking authentication status"
        color="blue"
      />
    );
  }

  // If user is authenticated and email verified, show redirecting state
  if (isAuthenticated && user && user.emailVerified) {
    return (
      <Loading
        fullScreen
        text="Already signed in"
        subtitle="Redirecting to dashboard..."
        color="green"
      />
    );
  }

  // Show auth pages for unauthenticated users OR users with unverified emails
  return <>{children}</>;
}
