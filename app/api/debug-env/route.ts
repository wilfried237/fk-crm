import { NextResponse } from 'next/server';

export async function GET() {
  // Only allow in development or with a secret key
  if (process.env.NODE_ENV === 'production' && !process.env.DEBUG_SECRET) {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const envCheck = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing',
    JWT_SECRET: process.env.JWT_SECRET ? '✅ Set' : '❌ Missing',
    DATABASE_URL: process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
    EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
    GMAIL_USER: process.env.GMAIL_USER ? '✅ Set' : '❌ Missing',
    GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD ? '✅ Set' : '❌ Missing',
  };

  return NextResponse.json({
    message: 'Environment variables check',
    env: envCheck,
    timestamp: new Date().toISOString(),
  });
} 