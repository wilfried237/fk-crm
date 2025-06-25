import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/email';

interface VerificationPayload {
  userId: string;
  email: string;
}

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Verification token is required.' }, { status: 400 });
    }

    // Verify the token
    let decoded: VerificationPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as VerificationPayload;
    } catch (error) {
      console.error('Error verifying token:', error);
      return NextResponse.json({ error: 'Invalid or expired verification token.' }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Check if email matches
    if (user.email !== decoded.email) {
      return NextResponse.json({ error: 'Invalid verification token.' }, { status: 400 });
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json({ 
        message: 'Email is already verified.',
        verified: true 
      });
    }

    // Mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() },
    });

    // Send welcome email after email verification
    try {
      await sendWelcomeEmail(user.email, user.name || 'User');
      console.log('✅ Welcome email sent after email verification:', user.email);
    } catch (emailError) {
      console.error('❌ Failed to send welcome email after verification:', emailError);
      // Don't fail the verification process if email fails
    }

    return NextResponse.json({ 
      message: 'Email verified successfully! You can now sign in.',
      verified: true 
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json({ error: 'Email verification failed.' }, { status: 500 });
  }
} 