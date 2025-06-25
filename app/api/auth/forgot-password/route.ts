import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ 
        message: 'If an account with that email exists, we have sent a password reset code.' 
      });
    }

    // Check if user has a password (credential-based user)
    if (!user.password) {
      return NextResponse.json({ 
        error: 'This account was created with Google. Please use Google Sign-In.' 
      }, { status: 400 });
    }

    // Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiry to 10 minutes from now
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    // Update user with OTP code and expiry
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: otpCode,
        resetPasswordExpiry: expiry,
      },
    });

    // Send password reset email with OTP code
    try {
      await sendPasswordResetEmail(user.email, user.name || '', otpCode);
      return NextResponse.json({ 
        message: 'If an account with that email exists, we have sent a password reset code.' 
      });
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      return NextResponse.json({ 
        error: 'Failed to send password reset email. Please try again later.' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
} 