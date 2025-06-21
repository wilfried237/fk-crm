import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export interface UserPayload {
    id: string;
    email: string;
    role: string;
}

interface AuthenticatedRequest extends NextRequest {
    user: UserPayload;
}

export async function withAuth(req: NextRequest): Promise<NextResponse | null> {
    try {
        // Get the value from the frontEnd Cookie
        const token = req.cookies.get('authToken')?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized: No token provided" }, { status: 401 });
        }

        // Verifying the token value
        const decoded = jwt.verify(token, process.env.RANDOM_SECRET_KEY as string) as UserPayload;
        
        // Attaching the token value to the req
        (req as AuthenticatedRequest).user = decoded;

        return null;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error in withAuth:', errorMessage);

        // Handle different JWT errors if needed
        if (error instanceof Error) {
            if (error.name === 'TokenExpiredError') {
                return NextResponse.json({ message: "Unauthorized: Token expired" }, { status: 401 });
            }
            if (error.name === 'JsonWebTokenError') {
                return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 });
            }
        }

        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
}

export async function withAuthAdmin(req: NextRequest): Promise<NextResponse | null> {
    const authResponse = await withAuth(req);

    if (authResponse) return authResponse;

    const decoded = (req as AuthenticatedRequest).user;
    
    if (decoded.role !== "ADMIN") {
        return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 403 });
    }

    return null;
}
