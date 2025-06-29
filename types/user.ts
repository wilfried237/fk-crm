// User interface for authentication and user management
export interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: string;
  emailVerified?: Date | null;
}

// Extended user data for dashboard display
export interface UserData extends User {
  // Additional fields that might be returned from API
  createdAt?: Date;
  updatedAt?: Date;
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// JWT payload interface
export interface JWTPayload {
  id: string;
  email: string;
  name?: string;
  role: string;
}

// API response types
export interface AuthResponse {
  user: User;
  message?: string;
}

export interface ErrorResponse {
  error: string;
  details?: unknown;
}

// User role types
export type UserRole = 'user' | 'admin' | 'moderator';

// User status types
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending'; 