# FK CRM Authentication Setup Guide

## Overview
This guide will help you set up the complete authentication system for FK CRM, including user registration, login, password reset, and email functionality.

## 1. Environment Variables Setup

Create a `.env` file in your project root with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fk_crm"

# JWT Secret (generate a strong secret for production)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Email Configuration
EMAIL_PROVIDER="gmail" # Options: gmail, outlook, sendgrid, resend, mailgun
FROM_EMAIL="noreply@yourdomain.com"

# Gmail Configuration (if using Gmail)
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-gmail-app-password"

# Outlook Configuration (if using Outlook)
OUTLOOK_USER="your-email@outlook.com"
OUTLOOK_PASSWORD="your-outlook-password"

# SendGrid Configuration (if using SendGrid)
SENDGRID_API_KEY="your-sendgrid-api-key"

# Resend Configuration (if using Resend)
RESEND_API_KEY="your-resend-api-key"

# Mailgun Configuration (if using Mailgun)
MAILGUN_USER="your-mailgun-user"
MAILGUN_PASSWORD="your-mailgun-password"
```

## 2. Email Provider Options

### Gmail (Recommended for Development)
- **Pros**: Free, easy setup, reliable
- **Cons**: Limited to 500 emails/day for free accounts
- **Setup**: 
  1. Enable 2-factor authentication on your Gmail account
  2. Generate an App Password
  3. Use the App Password in `GMAIL_APP_PASSWORD`

### SendGrid
- **Pros**: 100 emails/day free, excellent deliverability, good for production
- **Cons**: Requires credit card for verification
- **Setup**: 
  1. Create account at sendgrid.com
  2. Get API key from dashboard
  3. Set `EMAIL_PROVIDER="sendgrid"`

### Resend
- **Pros**: 100 emails/day free, modern API, great developer experience
- **Cons**: Newer service
- **Setup**: 
  1. Create account at resend.com
  2. Get API key from dashboard
  3. Set `EMAIL_PROVIDER="resend"`

### Mailgun
- **Pros**: 5,000 emails/month free, excellent for production
- **Cons**: Requires domain verification
- **Setup**: 
  1. Create account at mailgun.com
  2. Verify your domain
  3. Get SMTP credentials

### Outlook
- **Pros**: Free, good for personal projects
- **Cons**: Less reliable than others
- **Setup**: 
  1. Use your Outlook email and password
  2. Set `EMAIL_PROVIDER="outlook"`

## 3. Database Setup

### PostgreSQL Setup
1. Install PostgreSQL on your system
2. Create a new database:
   ```sql
   CREATE DATABASE fk_crm;
   ```
3. Update your `DATABASE_URL` in `.env`
4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

### Alternative: SQLite (for development)
If you prefer SQLite for development, update your `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

## 4. API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "resetCode": "123456",
  "newPassword": "newsecurepassword123"
}
```

#### Get User Profile
```http
GET /api/auth/me
Authorization: Bearer <jwt-token>
```

#### Update User Profile
```http
PUT /api/auth/me
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "John Smith"
}
```

## 5. Frontend Integration

### Example: Login Function
```typescript
const login = async (email: string, password: string) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (response.ok) {
      // Store token in localStorage or cookies
      localStorage.setItem('auth-token', data.token);
      // Redirect to dashboard
      router.push('/dashboard');
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

### Example: Protected API Call
```typescript
const fetchUserProfile = async () => {
  const token = localStorage.getItem('auth-token');
  
  const response = await fetch('/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  return data.user;
};
```

## 6. Security Features

### Password Reset Flow
1. User requests password reset with email
2. System generates 6-digit code
3. Code is sent via email with 10-minute expiry
4. User enters code and new password
5. System validates code and updates password
6. Reset token is cleared from database

### JWT Token Security
- Tokens expire after 7 days
- Tokens are verified on protected routes
- User data is excluded from token payload

### Password Security
- Passwords are hashed using bcrypt with 12 salt rounds
- Minimum 8 characters required
- Passwords are never stored in plain text

## 7. Testing the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test registration:
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
   ```

3. Test login:
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

## 8. Production Considerations

1. **Environment Variables**: Use strong, unique secrets
2. **Database**: Use managed PostgreSQL service (e.g., Supabase, Railway)
3. **Email**: Use SendGrid or Resend for production
4. **HTTPS**: Always use HTTPS in production
5. **Rate Limiting**: Implement rate limiting for auth endpoints
6. **Logging**: Add proper logging for security events
7. **Monitoring**: Monitor failed login attempts

## 9. Troubleshooting

### Common Issues

1. **Email not sending**: Check email provider credentials
2. **Database connection**: Verify DATABASE_URL format
3. **JWT errors**: Ensure JWT_SECRET is set
4. **CORS issues**: Configure CORS for your domain

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=true
```

## 10. Next Steps

1. Integrate with your frontend forms
2. Add email verification functionality
3. Implement role-based access control
4. Add session management
5. Set up password strength requirements
6. Add two-factor authentication (optional) 