import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test a simple query
    const userCount = await prisma.user.count();
    console.log('✅ User count query successful:', userCount);
    
    // Test database URL (without exposing sensitive data)
    const dbUrl = process.env.DATABASE_URL;
    const dbInfo = {
      hasUrl: !!dbUrl,
      urlType: dbUrl ? (dbUrl.includes('postgresql') ? 'PostgreSQL' : 'Other') : 'None',
      isPooler: dbUrl ? dbUrl.includes('pooler') : false,
    };
    
    return NextResponse.json({
      message: 'Database connection test successful',
      userCount,
      databaseInfo: dbInfo,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    
    let errorMessage = 'Unknown database error';
    let errorDetails = {};
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = {
        name: error.name,
        stack: error.stack,
      };
    }
    
    return NextResponse.json({
      error: 'Database connection test failed',
      message: errorMessage,
      details: errorDetails,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 