import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Login route for NextAuth credentials provider
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;
        
        // Find user by email
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        
        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // Check if user has a password (OAuth users might not have one)
        if (!user.password) {
            return new NextResponse("Invalid credentials", { status: 401 });
        }

        // Verify password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return new NextResponse("Invalid credentials", { status: 401 });
        }
        
        // Return user data (NextAuth will handle the session)
        return NextResponse.json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}