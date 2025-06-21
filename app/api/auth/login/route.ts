import { prisma } from "@/lib/prisma";
import { NextResponse, } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {UserPayload} from "../../middleware/middleware";

// Login route manually
export async function POST(req: Request){
    try{
        const body = await req.json();
        const {email, password} = body;
        const user = await prisma.user.findUnique({
            where:{
                email
            }
        });
        if(!user){
            return new NextResponse("User not found", {status: 400});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect){
            return new NextResponse("Incorrect password", {status: 400});
        }
        
        // Generate JWT
        const token = jwt.sign(user as UserPayload,
            process.env.RANDOM_SECRET_KEY as string,
            {expiresIn: "1h", algorithm: "HS256"}
        )
        
        const response = NextResponse.json({message: "Login successful", token: token});
        
        response.cookies.set('authToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 3600000,
          })
        
        return response;
    }
    catch(error){
        return new NextResponse("Internal Error"+error, {status: 500})
    }
}

// Login route using google auth
// export async function GET(req: Request){
//     try{
//         const {searchParams} = new URL(req.url);
//         const code = searchParams.get('code');
//         const token = await getToken(code);
//         const user = await prisma.user.findUnique({
//             where:{
//                 email: token.email
//             }
//         });
//         if(!user){
//             return new NextResponse("User not found", {status: 400});
//         }
//         const isPasswordCorrect = await bcrypt.compare(token.password, user.password);
//         if(!isPasswordCorrect){
//             return new NextResponse("Incorrect password", {status: 400});
//         }
//         const response = NextResponse.json({message: "Login successful", token: token});
//         response.cookies.set('authToken', token, {
//             httpOnly: true,
//             secure: true,
//             sameSite: 'strict',
//             maxAge: 3600000,
//         })
//         return response;
//     }
//     catch(error){
//         return new NextResponse("Internal Error"+error, {status: 500});
//     }
// }