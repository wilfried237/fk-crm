import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export interface UserPayload {
    id: string;
    email: string;
    role: string;
}

export async function withAuth(req: NextRequest) {
    try {
        // Get the value from the frontEnd Cookie
        const token = req.cookies.get('authToken')?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized: No token provided" }, { status: 401 });
        }

        // Verifying the token value
        const decoded = jwt.verify(token, process.env.RANDOM_SECRET_KEY as string) as UserPayload;
        
        // Attaching the token value to the req
        (req as any).user = decoded;

        return null;
    } catch (error: any) {
        console.error('Error in withAuth:', error.message);

        // Handle different JWT errors if needed
        if (error.name === 'TokenExpiredError') {
            return NextResponse.json({ message: "Unauthorized: Token expired" }, { status: 401 });
        }
        if (error.name === 'JsonWebTokenError') {
            return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 });
        }

        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
}

export async function withAuthAdmin(req: NextRequest) {
    const authResponse = await withAuth(req);

    if (authResponse) return authResponse;

    const decoded = (req as any).user;
    
    if (decoded.role !== "ADMIN") {
        return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 403 });
    }

    return null;
}
