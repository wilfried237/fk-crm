"use client"

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Mail, Shield, RefreshCw, Database, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface UserData {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
  image?: string | null;
}

interface ApplicationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  waitlisted: number;
}

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [applicationStats, setApplicationStats] = useState<ApplicationStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    waitlisted: 0
  });

  const fetchUserData = async () => {
    setIsLoadingUserData(true);
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        toast.success('User data refreshed');
      } else {
        toast.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Error fetching user data');
    } finally {
      setIsLoadingUserData(false);
    }
  };

  const fetchApplicationStats = async () => {
    try {
      const response = await fetch('/api/applications/admin');
      if (response.ok) {
        const data = await response.json();
        const applications = data.applications;
        
        const stats = {
          total: applications.length,
          pending: applications.filter((app: any) => app.status === 'PENDING').length,
          approved: applications.filter((app: any) => app.status === 'APPROVED').length,
          rejected: applications.filter((app: any) => app.status === 'REJECTED').length,
          waitlisted: applications.filter((app: any) => app.status === 'WAITLISTED').length,
        };
        
        setApplicationStats(stats);
      }
    } catch (error) {
      console.error('Error fetching application stats:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserData();
      fetchApplicationStats();
    }
  }, [isAuthenticated, user]);

  const handleSignOut = async () => {
    await logout();
    router.push('/sign-in');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome to FK CRM</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => router.push('/dashboard/applications')}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Manage Applications</span>
              </Button>
              <Button 
                onClick={() => router.push('/dashboard/oauth-data')}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Database className="h-4 w-4" />
                <span>View OAuth Data</span>
              </Button>
              <Button 
                onClick={fetchUserData}
                variant="outline"
                disabled={isLoadingUserData}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingUserData ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
              <Button 
                onClick={handleSignOut}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>

          {/* User Profile Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>User Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.image || ''} />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{user?.name || 'No name provided'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600 capitalize">{user?.role || 'user'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Data Card */}
          {userData && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>API User Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm text-gray-700 overflow-auto">
                    {JSON.stringify(userData, null, 2)}
                  </pre>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  This data was fetched from the protected API route
                </p>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">{applicationStats.total}</p>
                <p className="text-sm text-gray-500">Total students</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{applicationStats.approved}</p>
                <p className="text-sm text-gray-500">Approved applications</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pending Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-orange-600">{applicationStats.pending}</p>
                <p className="text-sm text-gray-500">Pending applications</p>
              </CardContent>
            </Card>
          </div>

          {/* Welcome Message */}
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Welcome to FK CRM! This is your dashboard where you can manage student relationships and applications.
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Add your first student to get started</p>
                <p>• Track application progress</p>
                <p>• Manage student communications</p>
                <p>• Generate reports and analytics</p>
                <p>• View OAuth user data in the database</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
} 