import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({
                authenticated: false,
                message: "No session found"
            });
        }

        return NextResponse.json({
            authenticated: true,
            session: {
                user: session.user,
                hasUsername: !!session.user?.username,
                username: session.user?.username || null,
                email: session.user?.email || null,
                name: session.user?.name || null,
            }
        });
    } catch (error) {
        console.error("Error checking session:", error);
        return NextResponse.json({
            error: "Failed to check session",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
