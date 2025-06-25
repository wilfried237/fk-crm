"use client"

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowLeft, RefreshCw, Database, User, Mail, Shield } from 'lucide-react';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface OAuthUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  googleId?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function OAuthDataPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [oauthUsers, setOauthUsers] = useState<OAuthUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOAuthUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/oauth-users', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setOauthUsers(data.users);
        toast.success('OAuth users data refreshed');
      } else {
        toast.error('Failed to fetch OAuth users');
      }
    } catch (error) {
      console.error('Error fetching OAuth users:', error);
      toast.error('Error fetching OAuth users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOAuthUsers();
    }
  }, [isAuthenticated]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">OAuth Users Data</h1>
                <p className="text-gray-600">View all users who signed up via Google OAuth</p>
              </div>
            </div>
            <Button 
              onClick={fetchOAuthUsers}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>

          {/* Current User Info */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Current User</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-700 overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* OAuth Users List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>All OAuth Users ({oauthUsers.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {oauthUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No OAuth users found</p>
                  <p className="text-sm text-gray-400">Users who sign up via Google OAuth will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {oauthUsers.map((oauthUser) => (
                    <div key={oauthUser.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{oauthUser.name || 'No name'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">{oauthUser.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600 capitalize">{oauthUser.role}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {oauthUser.googleId ? 'Google OAuth' : 'Credentials'}
                        </div>
                      </div>
                      <div className="mt-2">
                        <pre className="text-xs text-gray-500 bg-gray-50 p-2 rounded overflow-auto">
                          {JSON.stringify(oauthUser, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
} 