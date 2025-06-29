import {  NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/admin-auth';
import { AdminApplicationsResponse } from '@/types/admin';

export async function GET() {
  try {
    // Check if user is admin
    if (!isAdmin()) {
      return NextResponse.json(
        { applications: [], total: 0, error: 'Unauthorized - Admin access required' } as AdminApplicationsResponse,
        { status: 403 }
      );
    }
    
    const applications = await prisma.application.findMany({
      include: {
        documents: {
          orderBy: {
            uploadedAt: 'desc'
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      }
    });

    return NextResponse.json({
      applications,
      total: applications.length
    });

  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { applications: [], total: 0, error: 'Internal server error' } as AdminApplicationsResponse,
      { status: 500 }
    );
  }
} 