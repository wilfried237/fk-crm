"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Mail, 
  Shield,
  Bell,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface UserButtonProps {
  variant?: 'default' | 'minimal' | 'dropdown' | 'profile';
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  showEmail?: boolean;
  showRole?: boolean;
  className?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  onApplicationsClick?: () => void;
  onNotificationsClick?: () => void;
  onHelpClick?: () => void;
}

export function UserButton({
  variant = 'default',
  size = 'md',
  showName = true,
  showEmail = false,
  showRole = false,
  className = '',
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  onApplicationsClick,
  onNotificationsClick,
  onHelpClick,
}: UserButtonProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/sign-in');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      router.push('/dashboard');
    }
    setIsDropdownOpen(false);
  };

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      router.push('/dashboard/settings');
    }
    setIsDropdownOpen(false);
  };

  const handleApplicationsClick = () => {
    if (onApplicationsClick) {
      onApplicationsClick();
    } else {
      router.push('/dashboard/applications');
    }
    setIsDropdownOpen(false);
  };

  const handleNotificationsClick = () => {
    if (onNotificationsClick) {
      onNotificationsClick();
    } else {
      router.push('/dashboard/notifications');
    }
    setIsDropdownOpen(false);
  };

  const handleHelpClick = () => {
    if (onHelpClick) {
      onHelpClick();
    } else {
      router.push('/help');
    }
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    if (onLogoutClick) {
      onLogoutClick();
    } else {
      handleLogout();
    }
    setIsDropdownOpen(false);
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return 'U';
    if (user.name) {
      return user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Size classes
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };    

  if (!isAuthenticated || !user) {
    return (
      <Button
        variant="outline"
        size={size === 'md' ? 'default' : size}
        onClick={() => router.push('/sign-in')}
        className={className}
      >
        <User className="w-4 h-4 mr-2" />
        Sign In
      </Button>
    );
  }

  // Minimal variant - just avatar
  if (variant === 'minimal') {
    return (
      <Button
        variant="ghost"
        size={size === 'md' ? 'default' : size}
        onClick={handleProfileClick}
        className={`p-0 rounded-full ${className}`}
      >
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={user.image || ''} alt={user.name || user.email || ''} />
          <AvatarFallback>{getUserInitials()}</AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  // Default variant - avatar with name
  if (variant === 'default') {
    return (
      <Button
        variant="ghost"
        size={size === 'md' ? 'default' : size}
        onClick={handleProfileClick}
        className={`flex items-center space-x-2 ${className}`}
      >
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={user.image || ''} alt={user.name || user.email || ''} />
          <AvatarFallback>{getUserInitials()}</AvatarFallback>
        </Avatar>
        {showName && (
          <div className="text-left">
            <div className="font-medium">{user.name || 'User'}</div>
            {showEmail && user.email && (
              <div className="text-xs text-gray-500">{user.email}</div>
            )}
            {showRole && user.role && (
              <div className="text-xs text-gray-500 capitalize">{user.role}</div>
            )}
          </div>
        )}
      </Button>
    );
  }

  // Profile variant - detailed user info
  if (variant === 'profile') {
    return (
      <div className={`flex items-center space-x-3 p-3 bg-gray-50 rounded-lg ${className}`}>
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={user.image || ''} alt={user.name || user.email || ''} />
          <AvatarFallback>{getUserInitials()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900">{user.name || 'User'}</div>
          {user.email && (
            <div className="text-sm text-gray-500 flex items-center">
              <Mail className="w-3 h-3 mr-1" />
              {user.email}
            </div>
          )}
          {user.role && (
            <div className="text-sm text-gray-500 flex items-center">
              <Shield className="w-3 h-3 mr-1" />
              {user.role}
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSettingsClick}
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  // Dropdown variant - with dropdown menu
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size={size === 'md' ? 'default' : size}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`flex items-center space-x-2 ${className}`}
      >
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={user.image || ''} alt={user.name || user.email || ''} />
          <AvatarFallback>{getUserInitials()}</AvatarFallback>
        </Avatar>
        {showName && (
          <div className="text-left">
            <div className="font-medium">{user.name || 'User'}</div>
            {showEmail && user.email && (
              <div className="text-xs text-gray-500">{user.email}</div>
            )}
          </div>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            {/* User Info Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.image || ''} alt={user.name || user.email || ''} />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{user.name || 'User'}</div>
                  {user.email && (
                    <div className="text-sm text-gray-500 truncate">{user.email}</div>
                  )}
                  {user.role && (
                    <div className="text-xs text-gray-400 capitalize">{user.role}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={handleProfileClick}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <User className="w-4 h-4 mr-3" />
                Profile
              </button>
              
              <button
                onClick={handleApplicationsClick}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <FileText className="w-4 h-4 mr-3" />
                Applications
              </button>
              
              <button
                onClick={handleNotificationsClick}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-4 h-4 mr-3" />
                Notifications
              </button>
              
              <button
                onClick={handleSettingsClick}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </button>
              
              <button
                onClick={handleHelpClick}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <HelpCircle className="w-4 h-4 mr-3" />
                Help & Support
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Logout */}
            <div className="py-2">
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 