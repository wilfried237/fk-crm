import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Return user data
    return NextResponse.json({
      user: session.user,
      message: "User data retrieved successfully"
    });
  } catch (error) {
    console.error('Protected route error:', error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, email } = body;

    // Here you would update the user in the database
    // For now, just return the session user with updated fields
    const updatedUser = {
      ...session.user,
      name: name || session.user.name,
      email: email || session.user.email
    };

    return NextResponse.json({
      user: session.user,
      message: "User updated successfully"
    });
  } catch (error) {
    console.error('Protected route error:', error);
    return new NextResponse("Internal server error", { status: 500 });
  }
} 