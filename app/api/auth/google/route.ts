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
    const { credential } = await req.json();

    if (!credential) {
      return NextResponse.json({ error: 'Credential is required.' }, { status: 400 });
    }

    // Verify the Google token
    const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
    
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    
    if (!payload) {
      return NextResponse.json({ error: 'Invalid Google token.' }, { status: 400 });
    }

    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      return NextResponse.json({ error: 'Email is required from Google.' }, { status: 400 });
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { 
        email: email.toLowerCase(),
    },
    });
    
    if(user && !user.emailVerified){
      return NextResponse.json({ error: 'Email is not verified.' }, { status: 400 });
    }

    let isNewUser = false;

    if (user) {
      // If user exists but doesn't have googleId, update it
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { 
            googleId,
            image: picture || user.image,
            // Don't update emailVerified if already set
          },
        });
      }
    } else {
      // Create new user with Google OAuth
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

    const token = jwt.sign(
      userPayload,
      process.env.JWT_SECRET as string,
      { expiresIn: "1h", algorithm: "HS256" }
    );

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

    return response;
  } catch (error) {
    console.error('Google login error:', error);
    return NextResponse.json({ error: 'Google login failed.' }, { status: 500 });
  }
} 