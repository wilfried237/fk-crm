"use client"

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import Loading from '@/components/ui/loading';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setVerificationStatus('error');
      setMessage('No verification token provided.');
    }
  }, [token]);

  const verifyEmail = async () => {
    if (!token) return;

    setIsVerifying(true);
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationStatus('success');
        setMessage(data.message);
        toast.success('Email verified successfully!');
      } else {
        setVerificationStatus('error');
        setMessage(data.error);
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      setVerificationStatus('error');
      setMessage('An error occurred during verification.');
      toast.error('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSignIn = () => {
    router.push('/sign-in');
  };

  const handleResendEmail = async () => {
    // Get email from URL params or prompt user
    const email = searchParams.get('email');
    
    if (!email) {
      toast.error('Email address is required to resend verification');
      return;
    }

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Error resending verification email:', error);
      toast.error('Failed to resend verification email');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {verificationStatus === 'idle' && isVerifying && (
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            )}
            {verificationStatus === 'success' && (
              <CheckCircle className="h-12 w-12 text-green-600" />
            )}
            {verificationStatus === 'error' && (
              <XCircle className="h-12 w-12 text-red-600" />
            )}
          </div>
          <CardTitle className="text-xl">
            {verificationStatus === 'idle' && isVerifying && 'Verifying Email...'}
            {verificationStatus === 'success' && 'Email Verified!'}
            {verificationStatus === 'error' && 'Verification Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            {verificationStatus === 'idle' && isVerifying && 
              'Please wait while we verify your email address...'
            }
            {verificationStatus === 'success' && 
              'Your email has been successfully verified. You can now sign in to your account.'
            }
            {verificationStatus === 'error' && message}
          </p>

          {verificationStatus === 'success' && (
            <div className="space-y-3">
              <Button 
                onClick={handleSignIn}
                className="w-full"
              >
                Sign In
              </Button>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="space-y-3">
              <Button 
                onClick={handleSignIn}
                variant="outline"
                className="w-full"
              >
                Go to Sign In
              </Button>
              <Button 
                onClick={handleResendEmail}
                variant="outline"
                className="w-full"
              >
                <Mail className="h-4 w-4 mr-2" />
                Resend Verification Email
              </Button>
            </div>
          )}

          {verificationStatus === 'idle' && isVerifying && (
            <div className="text-center">
              <p className="text-sm text-gray-500">
                This may take a few moments...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Loading
          fullScreen
          text="Loading verification page..."
          subtitle="Please wait"
          color="blue"
        />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
} 