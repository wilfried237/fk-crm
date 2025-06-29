import { NextRequest, NextResponse } from 'next/server';
import { sendApplicationConfirmationEmail } from '@/lib/email';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { TransformedApplicationData, ApplicationSubmissionResponse } from '@/types/application';

// Validation schema for application data
const applicationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
  homeAddress: z.string().min(10, "Home address must be at least 10 characters"),
  university: z.string().min(1, "University selection is required"),
  course: z.string().min(2, "Course name must be at least 2 characters"),
  courseLevel: z.string().min(1, "Course level is required"),
  preferredIntake: z.string().min(1, "Preferred intake is required"),
  previousEducation: z.string().min(10, "Previous education details must be at least 10 characters"),
  englishProficiency: z.string().min(1, "English proficiency test is required"),
  englishScore: z.string().optional(),
  emergencyContact: z.string().min(2, "Emergency contact name is required"),
  emergencyPhone: z.string().min(10, "Emergency contact phone is required"),
  financialSupport: z.string().optional(),
  notes: z.string().optional(),
  documents: z.object({
    passport: z.array(z.object({
      id: z.string(),
      fileName: z.string(),
      fileUrl: z.string(),
      fileSize: z.number(),
      mimeType: z.string(),
    })),
    transcripts: z.array(z.object({
      id: z.string(),
      fileName: z.string(),
      fileUrl: z.string(),
      fileSize: z.number(),
      mimeType: z.string(),
    })),
    englishTest: z.array(z.object({
      id: z.string(),
      fileName: z.string(),
      fileUrl: z.string(),
      fileSize: z.number(),
      mimeType: z.string(),
    })),
    personalStatement: z.array(z.object({
      id: z.string(),
      fileName: z.string(),
      fileUrl: z.string(),
      fileSize: z.number(),
      mimeType: z.string(),
    })),
    references: z.array(z.object({
      id: z.string(),
      fileName: z.string(),
      fileUrl: z.string(),
      fileSize: z.number(),
      mimeType: z.string(),
    })),
  }),
});

export async function POST(request: NextRequest): Promise<NextResponse<ApplicationSubmissionResponse>> {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData: TransformedApplicationData = applicationSchema.parse(body);
    
    // Check if application with this email already exists
    const existingApplication = await prisma.application.findFirst({
      where: {
        email: validatedData.email,
        status: {
          in: ['PENDING', 'UNDER_REVIEW']
        }
      }
    });

    if (existingApplication) {
      return NextResponse.json(
        { success: false, error: 'An application with this email is already pending review' },
        { status: 400 }
      );
    }

    // Create the application
    const application = await prisma.application.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        dateOfBirth: new Date(validatedData.dateOfBirth),
        nationality: validatedData.nationality,
        homeAddress: validatedData.homeAddress,
        university: validatedData.university,
        course: validatedData.course,
        courseLevel: validatedData.courseLevel,
        preferredIntake: validatedData.preferredIntake,
        previousEducation: validatedData.previousEducation,
        englishProficiency: validatedData.englishProficiency,
        englishScore: validatedData.englishScore,
        emergencyContact: validatedData.emergencyContact,
        emergencyPhone: validatedData.emergencyPhone,
        financialSupport: validatedData.financialSupport,
        notes: validatedData.notes,
      },
    });

    // Create document records
    const documentTypes = {
      passport: 'PASSPORT',
      transcripts: 'TRANSCRIPTS',
      englishTest: 'ENGLISH_TEST',
      personalStatement: 'PERSONAL_STATEMENT',
      references: 'REFERENCES',
    } as const;

    const documentPromises = Object.entries(validatedData.documents).flatMap(([type, files]) =>
      files.map(file =>
        prisma.applicationDocument.create({
          data: {
            applicationId: application.id,
            type: documentTypes[type as keyof typeof documentTypes],
            fileName: file.fileName,
            fileUrl: file.fileUrl,
            fileSize: file.fileSize,
            mimeType: file.mimeType,
          },
        })
      )
    );

    await Promise.all(documentPromises);

    // Send confirmation email
    try {
      await sendApplicationConfirmationEmail(
        validatedData.email,
        validatedData.firstName,
        validatedData.lastName,
        application.id
      );
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the application submission if email fails
    }

    return NextResponse.json({
      success: true,
      applicationId: application.id,
      message: 'Application submitted successfully'
    });

  } catch (error) {
    console.error('Application submission error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const applicationId = searchParams.get('id');

    if (email) {
      const applications = await prisma.application.findMany({
        where: { email },
        include: {
          documents: true,
        },
        orderBy: { submittedAt: 'desc' }
      });

      return NextResponse.json({ applications });
    }

    if (applicationId) {
      const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: {
          documents: true,
        }
      });

      if (!application) {
        return NextResponse.json(
          { error: 'Application not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ application });
    }

    return NextResponse.json(
      { error: 'Email or application ID is required' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 