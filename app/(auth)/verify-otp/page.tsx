"use client"

import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Logo } from "@/components/ui/logo"

const otpSchema = z.object({
  otp: z.string().length(6, "Please enter the 6-digit code"),
});

type OtpForm = z.infer<typeof otpSchema>;

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const form = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    }
  });

  const onSubmit = async (values: OtpForm) => {
    if (!email) {
      toast.error('Email is required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: values.otp,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetToken(data.resetToken);
        setIsVerified(true);
        toast.success('OTP verified successfully!');
      } else {
        toast.error(data.error || 'Invalid OTP code');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      toast.error('Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error('Email is required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('New code sent to your email');
      } else {
        toast.error(data.error || 'Failed to resend code');
      }
    } catch (error) {
      console.error('Resend error:', error);
      toast.error('Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToReset = () => {
    if (resetToken) {
      router.push(`/reset-password?email=${email}&token=${resetToken}`);
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <Logo size="lg" className="mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Code Verified!</h1>
            <p className="text-gray-600">You can now reset your password</p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-4">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-xl font-semibold text-center">Success!</CardTitle>
              <CardDescription className="text-center">
                Your verification code has been confirmed. You can now create a new password.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Button 
                onClick={handleContinueToReset}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Continue to Reset Password
              </Button>

              <Button 
                onClick={() => setIsVerified(false)}
                variant="outline"
                className="w-full"
              >
                <div className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to OTP verification</span>
                </div>
              </Button>
            </CardContent>

            <CardFooter className="flex justify-center pt-4">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <Link 
                  href="/sign-in"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Logo size="lg" className="mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Enter verification code</h1>
          <p className="text-gray-600">We sent a 6-digit code to your email</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold text-center">Verify Code</CardTitle>
            <CardDescription className="text-center">
              Enter the 6-digit code sent to
            </CardDescription>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg inline-block">
                {email}
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          render={({ slots }) => (
                            <InputOTPGroup className="gap-2">
                              {slots.map((slot, index) => (
                                <InputOTPSlot key={index} {...slot} index={index} />
                              ))}
                            </InputOTPGroup>
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <span>Verify Code</span>
                  )}
                </Button>
              </form>
            </Form>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Didn&apos;t receive the code?</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Check your email inbox and spam folder</li>
                    <li>• The code expires in 10 minutes</li>
                    <li>• Click &quot;Resend code&quot; if needed</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleResendCode}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                    <span>Resending...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Resend code</span>
                  </div>
                )}
              </Button>

              <Button 
                onClick={() => router.push('/forgot-password')}
                variant="ghost"
                className="w-full"
              >
                <div className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to forgot password</span>
                </div>
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center pt-4">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link 
                href="/sign-in"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 