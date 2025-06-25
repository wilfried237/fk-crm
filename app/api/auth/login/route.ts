import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }
    
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }
    
    if (user.password) {
      if (!user.emailVerified) {
        return NextResponse.json(
          { error: 'Please verify your email address before signing in.' },
          { status: 401 }
        );
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
      }
    } else {
      return NextResponse.json(
        { error: 'This account was created with Google. Please use Google Sign-In.' },
        { status: 401 }
      );
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
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      token: token
    });

    // Set auth cookie with same settings as Google OAuth
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000, // 1 hour
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
  }
} 