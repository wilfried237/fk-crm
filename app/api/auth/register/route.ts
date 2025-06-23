import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server"
import { NextRequest } from "next/server";

// registration route manually
export async function POST(req: NextRequest){
    try{
        const body = await req.json();
        const {firstName, lastName, email, password} = body;
        
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where:{
                email
            }
        });
        
        if(existingUser){
            return new NextResponse("User already exists", {status: 400});
        }
        
        const hashedPassword = await bcrypt.hash(password, 12);
        const name = `${firstName} ${lastName}`;
        
        // Create user with new schema
        const newUser = await prisma.user.create({
            data:{
                name, 
                email, 
                password: hashedPassword, 
                role: "USER"
            }
        });

        return NextResponse.json({
            message: "User created successfully", 
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        }, {status: 201});
    }
    catch (error) {
        console.error('Registration error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return new NextResponse(`Internal Error: ${errorMessage}`, { status: 500 });
    }
}