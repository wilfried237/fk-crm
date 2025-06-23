# NextAuth.js Setup Guide for FK CRM

## Overview
This guide will help you complete the NextAuth.js integration with Google OAuth, GitHub OAuth, and credentials authentication.

## 1. Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fk_crm"
DIRECT_URL="postgresql://username:password@localhost:5432/fk_crm"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-nextauth-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Generate NEXTAUTH_SECRET
Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

## 2. OAuth Provider Setup

### Google OAuth Setup

#### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API

#### Step 2: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
5. Copy the Client ID and Client Secret to your `.env.local`

### GitHub OAuth Setup

#### Step 1: Create GitHub OAuth App
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: FK CRM
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the Client ID and Client Secret to your `.env.local`

## 3. Database Setup

### Run Prisma Migrations
```bash
# Generate Prisma client
npx prisma generate

# Create and run migration
npx prisma migrate dev --name add-nextauth-tables

# Push to database (if using direct push)
npx prisma db push
```

## 4. TypeScript Types

The TypeScript types are already configured in `types/next-auth.d.ts`:

```typescript
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
  }
}
```

## 5. Testing the Setup

### Start the Development Server
```bash
npm run dev
```

### Test Credentials Sign Up
1. Go to `http://localhost:3000/sign-up`
2. Fill in the form with test data
3. Submit and verify the account is created
4. Check the database for the new user

### Test Google OAuth
1. Go to `http://localhost:3000/sign-in`
2. Click the "Google" button
3. Complete the Google OAuth flow
4. Verify the user is created in the database

### Test GitHub OAuth
1. Go to `http://localhost:3000/sign-in`
2. Click the "GitHub" button
3. Complete the GitHub OAuth flow
4. Verify the user is created in the database

### Test Credentials Sign In
1. Go to `http://localhost:3000/sign-in`
2. Use the credentials from the sign-up test
3. Verify successful login

## 6. How It Works

### Authentication Flow

#### Manual Registration (Credentials)
1. User fills out sign-up form
2. Frontend calls `/api/auth/register` to create user
3. User is automatically signed in using NextAuth credentials
4. User is redirected to dashboard

#### OAuth Registration (Google/GitHub)
1. User clicks OAuth button
2. NextAuth handles OAuth flow
3. `signIn` callback creates/updates user in database
4. User is automatically signed in
5. User is redirected to dashboard

#### Manual Sign In (Credentials)
1. User enters email/password
2. NextAuth validates credentials against database
3. User is signed in and redirected to dashboard

#### OAuth Sign In (Google/GitHub)
1. User clicks OAuth button
2. NextAuth handles OAuth flow
3. If user exists, they're signed in
4. If user doesn't exist, they're created and signed in
5. User is redirected to dashboard

## 7. Production Deployment

### Environment Variables for Production
Update your production environment variables:
```env
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-secret"
GOOGLE_CLIENT_ID="your-production-google-client-id"
GOOGLE_CLIENT_SECRET="your-production-google-client-secret"
GITHUB_ID="your-production-github-client-id"
GITHUB_SECRET="your-production-github-client-secret"
```

### OAuth Redirect URIs for Production
Update your OAuth app settings:

**Google Cloud Console:**
- Add: `https://yourdomain.com/api/auth/callback/google`

**GitHub OAuth App:**
- Update Authorization callback URL to: `https://yourdomain.com/api/auth/callback/github`

### Database Migration
```bash
npx prisma migrate deploy
```

## 8. Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Check that your redirect URIs in OAuth providers match exactly
   - Include both http and https versions if needed

2. **Database connection errors**
   - Verify DATABASE_URL is correct
   - Ensure database is running and accessible

3. **"Invalid credentials" error**
   - Check that the user exists in the database
   - Verify password hashing is working correctly

4. **NextAuth secret not set**
   - Ensure NEXTAUTH_SECRET is set in environment variables
   - Generate a new secret if needed

5. **OAuth provider errors**
   - Verify OAuth app credentials are correct
   - Check that OAuth apps are properly configured
   - Ensure redirect URIs match exactly

### Debug Mode
Enable debug mode by adding to `.env.local`:
```env
NEXTAUTH_DEBUG=true
```

## 9. Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Secrets**: Use strong, unique secrets for production
3. **HTTPS**: Always use HTTPS in production
4. **CORS**: Configure CORS properly for your domain
5. **Rate Limiting**: Consider adding rate limiting to auth endpoints
6. **OAuth Scopes**: Only request necessary OAuth scopes

## 10. Features Available

- ✅ **Manual Registration** (email/password)
- ✅ **Manual Sign In** (email/password)
- ✅ **Google OAuth** (sign up and sign in)
- ✅ **GitHub OAuth** (sign up and sign in)
- ✅ **Session Management**
- ✅ **Protected Routes**
- ✅ **User Role Management**
- ✅ **Database Integration**
- ✅ **Automatic User Creation** for OAuth users

## 11. Next Steps

After completing this setup:

1. Create protected routes using NextAuth middleware
2. Add user profile management
3. Implement role-based access control
4. Add email verification (optional)
5. Set up password reset functionality
6. Add session management features
7. Implement user account linking (connect multiple OAuth providers)

## Support

If you encounter any issues:
1. Check the NextAuth.js documentation
2. Verify all environment variables are set correctly
3. Check the browser console and server logs for errors
4. Ensure your database is properly configured
5. Verify OAuth app configurations 