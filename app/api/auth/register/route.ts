import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "@/lib/email";
import { NextRequest } from "next/server";


// registration route manually
export async function POST(req: NextRequest){
    try{
        const body = await req.json();
        const {firstName, lastName, email, password} = body;
        // Check if user exists outside transaction
        const user = await prisma.user.findUnique({
            where:{
                email
            }
        });
        if(user){
            return new NextResponse("User already exists", {status: 400});
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const name = `${firstName} ${lastName}`;
        
        // Wrap database operations in transaction
        const newUser = await prisma.$transaction(async (tx) => {
            const createdUser = await tx.user.create({
                data:{
                    name, email, password: hashedPassword, role: "USER"
                }
            });
            return createdUser;
        });

        // send email to user for verification (outside transaction)
        const verificationToken = jwt.sign({email}, process.env.JWT_SECRET!, {expiresIn: "1h"});

        const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;
        await sendVerificationEmail(email, verificationLink);

        return NextResponse.json({message: "User created successfully", user: newUser}, {status: 201});
    }
    catch (error) {
        console.error('Registration error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return new NextResponse(`Internal Error: ${errorMessage}`, { status: 500 });
    }
      
}