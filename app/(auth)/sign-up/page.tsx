"use client"

import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Github, Chrome, Check } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Logo } from "@/components/ui/logo"

const signUpSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const router = useRouter();
  
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  const onSubmit = async (values: SignUpForm) => {
    setIsLoading(true);
    try {
      // First, create the user account using our local API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        }),
      });

      if (response.ok) {
        // Then sign in the user with NextAuth credentials
        const result = await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (result?.error) {
          toast.error('Sign up successful but login failed. Please sign in manually.');
          router.push('/sign-in');
        } else {
          toast.success('Account created successfully!');
          router.push('/dashboard');
        }
      } else {
        const error = await response.text();
        toast.error(error || 'Failed to create account');
      }
    } catch (error: any) {
      toast.error('An error occurred during sign up');
      console.error('Sign up error:', error);
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

  const password = form.watch("password");

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, color: 'bg-gray-200', text: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    
    return {
      strength: Math.min(strength, 5),
      color: colors[strength - 1] || 'bg-gray-200',
      text: texts[strength - 1] || ''
    };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Logo size="lg" className="mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-600">Join FK CRM to manage your student relationships</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold text-center">Sign Up</CardTitle>
            <CardDescription className="text-center">
              Fill in your details to create your account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              placeholder="John"
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
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              placeholder="Doe"
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
                </div>

                {/* Email Field */}
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
                            placeholder="john.doe@company.com"
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

                {/* Password Field */}
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
                            placeholder="Create a strong password"
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
                      
                      {/* Password Strength Indicator */}
                      {password && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Password strength:</span>
                            <span className="font-medium">{passwordStrength.text}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                              style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                            />
                          </div>
                          <div className="mt-2 text-xs text-gray-500">
                            <div className="flex items-center space-x-2">
                              <Check className={`h-3 w-3 ${password.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} />
                              <span>At least 8 characters</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Check className={`h-3 w-3 ${/[a-z]/.test(password) ? 'text-green-500' : 'text-gray-300'}`} />
                              <span>One lowercase letter</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Check className={`h-3 w-3 ${/[A-Z]/.test(password) ? 'text-green-500' : 'text-gray-300'}`} />
                              <span>One uppercase letter</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Check className={`h-3 w-3 ${/\d/.test(password) ? 'text-green-500' : 'text-gray-300'}`} />
                              <span>One number</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="pl-10 pr-10"
                            disabled={isLoading}
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{' '}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Create Account</span>
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
              Already have an account?{' '}
              <Link 
                href="/sign-in"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{' '}
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
