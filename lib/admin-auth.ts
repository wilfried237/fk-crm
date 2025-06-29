// import { NextRequest } from 'next/server';

// Simple admin check - you can enhance this with proper authentication
export function isAdmin(): boolean {
  // For now, we'll allow all access to admin routes
  // In production, you should implement proper admin authentication
  // This could be based on user role, JWT tokens, or session data
  
  // Example implementation:
  // const token = request.headers.get('authorization')?.replace('Bearer ', '');
  // const user = await verifyToken(token);
  // return user?.role === 'ADMIN';
  
  return true; // Temporary - allow all access
}

// Client-side admin check
export function isAdminClient(): boolean {
  // This would check the user's role from the client-side auth context
  // For now, return true to allow access
  return true;
} 