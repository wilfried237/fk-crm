import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { isAdmin } from '@/lib/admin-auth';
import { z } from 'zod';
import { AdminActionRequest, AdminActionResponse, StatusEmailConfigs } from '@/types/admin';

// Validation schema for admin actions
const actionSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required"),
  action: z.enum(['APPROVE', 'REJECT', 'WAITLIST']),
  reason: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    if (!isAdmin()) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' } as AdminActionResponse,
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate the request body
    const validatedData: AdminActionRequest = actionSchema.parse(body);
    
    // Find the application
    const application = await prisma.application.findUnique({
      where: { id: validatedData.applicationId },
      include: {
        documents: true
      }
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: 'Application not found' } as AdminActionResponse,
        { status: 404 }
      );
    }

    // Determine new status based on action
    let newStatus: 'APPROVED' | 'REJECTED' | 'WAITLISTED';
    switch (validatedData.action) {
      case 'APPROVE':
        newStatus = 'APPROVED';
        break;
      case 'REJECT':
        newStatus = 'REJECTED';
        break;
      case 'WAITLIST':
        newStatus = 'WAITLISTED';
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' } as AdminActionResponse,
          { status: 400 }
        );
    }

    // Update application status
    const updatedApplication = await prisma.application.update({
      where: { id: validatedData.applicationId },
      data: {
        status: newStatus,
        updatedAt: new Date(),
      },
      include: {
        documents: true
      }
    });

    // Send email notification to applicant
    try {
      await sendApplicationStatusEmail(
        application.email,
        application.firstName,
        application.lastName,
        application.id,
        newStatus,
        validatedData.reason
      );
    } catch (emailError) {
      console.error('Failed to send status email:', emailError);
      // Don't fail the action if email fails
    }

    return NextResponse.json({
      success: true,
      application: updatedApplication,
      message: `Application ${newStatus.toLowerCase()} successfully`
    });

  } catch (error) {
    console.error('Application action error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors } as AdminActionResponse,
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' } as AdminActionResponse,
      { status: 500 }
    );
  }
}

// Email function for application status updates
async function sendApplicationStatusEmail(
  email: string,
  firstName: string,
  lastName: string,
  applicationId: string,
  status: string,
  reason?: string
) {
  const statusConfig: StatusEmailConfigs = {
    APPROVED: {
      subject: 'Application Approved - FK Education',
      color: '#10B981',
      icon: '✅',
      title: 'Congratulations! Your application has been approved.',
      message: 'We are pleased to inform you that your application has been approved. You will receive further instructions shortly.'
    },
    REJECTED: {
      subject: 'Application Update - FK Education',
      color: '#EF4444',
      icon: '❌',
      title: 'Application Status Update',
      message: 'We regret to inform you that your application has not been approved at this time.'
    },
    WAITLISTED: {
      subject: 'Application Waitlisted - FK Education',
      color: '#8B5CF6',
      icon: '⏳',
      title: 'Application Waitlisted',
      message: 'Your application has been placed on our waitlist. We will contact you if a spot becomes available.'
    }
  };

  const config = statusConfig[status as keyof StatusEmailConfigs];
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Application Status Update</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .status-badge {
          display: inline-block;
          background: ${config.color};
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          margin: 10px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #666;
          font-size: 14px;
        }
        .highlight {
          background: #e8f4fd;
          padding: 15px;
          border-left: 4px solid #667eea;
          margin: 20px 0;
        }
        .reason-box {
          background: #fef3c7;
          padding: 15px;
          border-left: 4px solid #f59e0b;
          margin: 20px 0;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${config.icon} FK Education</h1>
        <p>Application Status Update</p>
      </div>
      
      <div class="content">
        <h2>${config.title}</h2>
        
        <div class="status-badge">
          ${config.icon} ${status}
        </div>
        
        <p>Dear ${firstName} ${lastName},</p>
        
        <p>${config.message}</p>
        
        <div class="highlight">
          <strong>Application ID:</strong> ${applicationId}<br>
          <strong>Status:</strong> ${status}<br>
          <strong>Date:</strong> ${new Date().toLocaleDateString()}
        </div>
        
        ${reason ? `
        <div class="reason-box">
          <strong>Additional Information:</strong><br>
          ${reason}
        </div>
        ` : ''}
        
        <p>If you have any questions, please don't hesitate to contact us.</p>
        
        <p>Best regards,<br>
        The FK Education Team</p>
      </div>
      
      <div class="footer">
        <p>This is an automated message. Please do not reply to this email.</p>
        <p>&copy; 2024 FK Education. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: config.subject,
    html: html,
  });
} 