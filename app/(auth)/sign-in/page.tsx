"use client"

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';
import Link from 'next/link';
import { signIn} from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Logo } from "@/components/ui/logo"

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  // Handle authentication errors from URL params
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      let errorMessage = 'An error occurred during sign in';
      
      switch (error) {
        case 'CredentialsSignin':
          errorMessage = 'Invalid email or password';
          break;
        case 'OAuthSignin':
          errorMessage = 'OAuth sign in failed';
          break;
        case 'OAuthCallback':
          errorMessage = 'OAuth callback failed';
          break;
        case 'OAuthCreateAccount':
          errorMessage = 'Could not create OAuth account';
          break;
        case 'OAuthAccountNotLinked':
          errorMessage = 'Email already exists with different provider';
          break;
        default:
          errorMessage = 'An error occurred during authentication';
      }
      
      toast.error(errorMessage);
    }
  }, [searchParams]);

  const onSubmit = async (values: SignInForm) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid email or password');
      } else {
        toast.success('Signed in successfully!');
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error('An error occurred during sign in');
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signIn('google', {
        callbackUrl: '/dashboard',
        redirect: false,
      });

      if (result?.error) {
        toast.error('Google sign in failed');
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      toast.error('An error occurred during Google sign in');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setIsGitHubLoading(true);
    try {
      const result = await signIn('github', {
        callbackUrl: '/dashboard',
        redirect: false,
      });

      if (result?.error) {
        toast.error('GitHub sign in failed');
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      toast.error('An error occurred during GitHub sign in');
    } finally {
      setIsGitHubLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Logo size="lg" className="mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            className="pl-10"
                            disabled={isLoading}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pl-10 pr-10"
                            disabled={isLoading}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="remember" className="text-sm text-gray-600">
                      Remember me
                    </label>
                  </div>
                  <Link 
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>
            </Form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="w-full" 
                disabled={isGoogleLoading}
                onClick={handleGoogleSignIn}
              >
                <Chrome className="h-4 w-4 mr-2" />
                Google
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                disabled={isGitHubLoading}
                onClick={handleGitHubSignIn}
              >
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center pt-4">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link 
                href="/sign-up"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-blue-600 hover:text-blue-700">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 