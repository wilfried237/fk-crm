import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { isAdmin } from '@/lib/admin-auth';
import { z } from 'zod';

// Validation schema for admin actions
const actionSchema = z.object({
  applicationId: z.string().min(1, "Application ID is required"),
  action: z.enum(['APPROVE', 'REJECT', 'WAITLIST']),
  reason: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    if (!isAdmin(request)) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate the request body
    const validatedData = actionSchema.parse(body);
    
    // Find the application
    const application = await prisma.application.findUnique({
      where: { id: validatedData.applicationId },
      include: {
        documents: true
      }
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
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
          { error: 'Invalid action' },
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
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
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
  const statusConfig = {
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

  const config = statusConfig[status as keyof typeof statusConfig];
  
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
          border: 1px solid #f59e0b;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${config.icon} Application Status Update</h1>
        <p>FK Education</p>
      </div>
      
      <div class="content">
        <h2>Dear ${firstName} ${lastName},</h2>
        
        <div class="status-badge">
          ${status.replace('_', ' ')}
        </div>
        
        <h3>${config.title}</h3>
        
        <p>${config.message}</p>
        
        <div class="highlight">
          <strong>Application ID:</strong> ${applicationId}<br>
          <strong>Status:</strong> ${status.replace('_', ' ')}<br>
          <strong>Date:</strong> ${new Date().toLocaleDateString()}
        </div>
        
        ${reason ? `
        <div class="reason-box">
          <h4>Additional Information:</h4>
          <p>${reason}</p>
        </div>
        ` : ''}
        
        <h3>Next Steps:</h3>
        ${status === 'APPROVED' ? `
        <ol>
          <li>You will receive detailed enrollment instructions within 48 hours</li>
          <li>Complete any additional requirements as specified</li>
          <li>Prepare for your academic journey</li>
        </ol>
        ` : status === 'REJECTED' ? `
        <ul>
          <li>You may reapply for future intakes</li>
          <li>Consider addressing any areas mentioned in the feedback</li>
          <li>Contact us if you have questions about the decision</li>
        </ul>
        ` : `
        <ul>
          <li>We will contact you if a spot becomes available</li>
          <li>You may also apply for other intakes</li>
          <li>Keep your contact information updated</li>
        </ul>
        `}
        
        <p>If you have any questions, please don't hesitate to contact us:</p>
        <ul>
          <li>Email: support@fkeducation.com</li>
          <li>Phone: +1 (555) 123-4567</li>
          <li>WhatsApp: +1 (555) 123-4567</li>
        </ul>
        
        <p>Thank you for your interest in FK Education.</p>
        
        <p>Best regards,<br>
        <strong>The FK Education Team</strong></p>
      </div>
      
      <div class="footer">
        <p>This is an automated message. Please do not reply to this email.</p>
        <p>© 2024 FK Education. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  const text = `
    Application Status Update - FK Education
    
    Dear ${firstName} ${lastName},
    
    ${config.title}
    
    ${config.message}
    
    Application ID: ${applicationId}
    Status: ${status.replace('_', ' ')}
    Date: ${new Date().toLocaleDateString()}
    
    ${reason ? `Additional Information: ${reason}` : ''}
    
    Next Steps:
    ${status === 'APPROVED' ? `
    1. You will receive detailed enrollment instructions within 48 hours
    2. Complete any additional requirements as specified
    3. Prepare for your academic journey
    ` : status === 'REJECTED' ? `
    - You may reapply for future intakes
    - Consider addressing any areas mentioned in the feedback
    - Contact us if you have questions about the decision
    ` : `
    - We will contact you if a spot becomes available
    - You may also apply for other intakes
    - Keep your contact information updated
    `}
    
    Contact Information:
    Email: support@fkeducation.com
    Phone: +1 (555) 123-4567
    WhatsApp: +1 (555) 123-4567
    
    Thank you for your interest in FK Education.
    
    Best regards,
    The FK Education Team
    
    This is an automated message. Please do not reply to this email.
    © 2024 FK Education. All rights reserved.
  `;

  return sendEmail({
    to: email,
    subject: config.subject,
    html,
    text,
  });
} 