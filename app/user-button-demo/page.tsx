"use client"

import React from 'react';
import { UserButton } from '@/components/ui/user-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function UserButtonDemo() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">User Button Component Demo</h1>
        <p className="text-gray-600">
          Showcasing different variants and configurations of the UserButton component
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Default Variant */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Default Variant
              <Badge variant="secondary">Default</Badge>
            </CardTitle>
            <CardDescription>
              Avatar with user name, clickable to navigate to profile
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <UserButton variant="default" />
          </CardContent>
        </Card>

        {/* Minimal Variant */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Minimal Variant
              <Badge variant="outline">Minimal</Badge>
            </CardTitle>
            <CardDescription>
              Just the avatar, perfect for compact layouts
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <UserButton variant="minimal" />
          </CardContent>
        </Card>

        {/* Profile Variant */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Profile Variant
              <Badge variant="secondary">Profile</Badge>
            </CardTitle>
            <CardDescription>
              Detailed user info with settings button
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserButton variant="profile" />
          </CardContent>
        </Card>

        {/* Dropdown Variant */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Dropdown Variant
              <Badge variant="default">Dropdown</Badge>
            </CardTitle>
            <CardDescription>
              Full dropdown menu with navigation options
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <UserButton variant="dropdown" />
          </CardContent>
        </Card>

        {/* Size Variations */}
        <Card>
          <CardHeader>
            <CardTitle>Size Variations</CardTitle>
            <CardDescription>
              Different sizes available: sm, md, lg
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Small:</span>
              <UserButton variant="default" size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Medium:</span>
              <UserButton variant="default" size="md" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Large:</span>
              <UserButton variant="default" size="lg" />
            </div>
          </CardContent>
        </Card>

        {/* Custom Configurations */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Configurations</CardTitle>
            <CardDescription>
              Show email and role information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">With Email:</span>
              <UserButton variant="default" showEmail={true} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">With Role:</span>
              <UserButton variant="default" showRole={true} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Name Only:</span>
              <UserButton variant="default" showName={true} showEmail={false} showRole={false} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      {/* Usage Examples */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
            <CardDescription>
              Code examples for different use cases
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Basic Usage:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`<UserButton variant="default" />`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">With Custom Handlers:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`<UserButton 
  variant="dropdown"
  onProfileClick={() => console.log('Profile clicked')}
  onSettingsClick={() => console.log('Settings clicked')}
  onLogoutClick={() => console.log('Logout clicked')}
/>`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Custom Styling:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`<UserButton 
  variant="minimal"
  size="lg"
  className="border-2 border-blue-200 hover:border-blue-300"
/>`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Props Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>Component Props</CardTitle>
            <CardDescription>
              Available props and their descriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Props:</h4>
                <ul className="space-y-2 text-sm">
                  <li><strong>variant:</strong> 'default' | 'minimal' | 'dropdown' | 'profile' - The visual style of the button</li>
                  <li><strong>size:</strong> 'sm' | 'md' | 'lg' - The size of the button and avatar</li>
                  <li><strong>showName:</strong> boolean - Whether to display the user's name</li>
                  <li><strong>showEmail:</strong> boolean - Whether to display the user's email</li>
                  <li><strong>showRole:</strong> boolean - Whether to display the user's role</li>
                  <li><strong>className:</strong> string - Additional CSS classes</li>
                  <li><strong>onProfileClick:</strong> function - Custom handler for profile click</li>
                  <li><strong>onSettingsClick:</strong> function - Custom handler for settings click</li>
                  <li><strong>onLogoutClick:</strong> function - Custom handler for logout click</li>
                  <li><strong>onApplicationsClick:</strong> function - Custom handler for applications click</li>
                  <li><strong>onNotificationsClick:</strong> function - Custom handler for notifications click</li>
                  <li><strong>onHelpClick:</strong> function - Custom handler for help click</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 