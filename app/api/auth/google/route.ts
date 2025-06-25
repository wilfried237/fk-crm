import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/email';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export async function POST(req: Request) {
  try {
    // Validate required environment variables
    const requiredEnvVars = {
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      JWT_SECRET: process.env.JWT_SECRET,
    };

    const missingEnvVars = Object.entries(requiredEnvVars)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missingEnvVars.length > 0) {
      console.error('Missing environment variables:', missingEnvVars);
      return NextResponse.json({ 
        error: 'Server configuration error. Please contact support.' 
      }, { status: 500 });
    }

    const { credential } = await req.json();

    if (!credential) {
      return NextResponse.json({ error: 'Credential is required.' }, { status: 400 });
    }

    console.log('🔍 Starting Google OAuth verification...');

    // Verify the Google token
    const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
    
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      });
    } catch (verifyError) {
      console.error('❌ Google token verification failed:', verifyError);
      return NextResponse.json({ error: 'Invalid Google token.' }, { status: 400 });
    }

    const payload = ticket.getPayload();
    
    if (!payload) {
      console.error('❌ No payload from Google token');
      return NextResponse.json({ error: 'Invalid Google token.' }, { status: 400 });
    }

    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      console.error('❌ No email in Google payload');
      return NextResponse.json({ error: 'Email is required from Google.' }, { status: 400 });
    }

    console.log('✅ Google token verified for email:', email);

    // Check if user already exists
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { 
          email: email.toLowerCase(),
        },
      });
    } catch (dbError) {
      console.error('❌ Database error finding user:', dbError);
      return NextResponse.json({ error: 'Database error.' }, { status: 500 });
    }
    
    if(user && !user.emailVerified){
      return NextResponse.json({ error: 'Email is not verified.' }, { status: 400 });
    }

    let isNewUser = false;

    if (user) {
      console.log('👤 Existing user found:', user.email);
      // If user exists but doesn't have googleId, update it
      if (!user.googleId) {
        try {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { 
              googleId,
              image: picture || user.image,
              // Don't update emailVerified if already set
            },
          });
          console.log('✅ Updated existing user with Google ID');
        } catch (updateError) {
          console.error('❌ Error updating user with Google ID:', updateError);
          return NextResponse.json({ error: 'Failed to update user.' }, { status: 500 });
        }
      }
    } else {
      console.log('🆕 Creating new user with Google OAuth');
      // Create new user with Google OAuth
      try {
        user = await prisma.user.create({
          data: {
            email,
            name: name || undefined,
            googleId,
            image: picture || undefined,
            role: 'USER',
            emailVerified: new Date(), // Google users are pre-verified
          },
        });
        isNewUser = true;
        console.log('✅ New user created:', user.email);
      } catch (createError) {
        console.error('❌ Error creating new user:', createError);
        return NextResponse.json({ error: 'Failed to create user.' }, { status: 500 });
      }
    }

    // Send welcome email for new Google OAuth users
    if (isNewUser) {
      try {
        await sendWelcomeEmail(user.email, user.name || 'User');
        console.log('✅ Welcome email sent to new Google OAuth user:', user.email);
      } catch (emailError) {
        console.error('❌ Failed to send welcome email to Google OAuth user:', emailError);
        // Don't fail the login process if email fails
      }
    }

    // Generate JWT token
    const userPayload: UserPayload = {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      role: user.role,
    };

    let token;
    try {
      token = jwt.sign(
        userPayload,
        process.env.JWT_SECRET as string,
        { expiresIn: "1h", algorithm: "HS256" }
      );
    } catch (jwtError) {
      console.error('❌ JWT signing error:', jwtError);
      return NextResponse.json({ error: 'Token generation failed.' }, { status: 500 });
    }

    console.log('✅ JWT token generated successfully');

    // Create response with user data
    const response = NextResponse.json({ 
      message: "Google login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
        emailVerified: user.emailVerified,
      },
      token: token
    });

    // Set auth cookie with same settings as other auth routes
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000, // 1 hour
    });

    console.log('✅ Google OAuth login completed successfully for:', user.email);
    return response;
  } catch (error) {
    console.error('❌ Google login error:', error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
    }
    
    return NextResponse.json({ 
      error: 'Google login failed. Please try again.' 
    }, { status: 500 });
  }
} 