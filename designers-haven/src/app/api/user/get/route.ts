import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust path as needed
import User from "@/models/User"; // Adjust path as needed
import { connectDB } from "@/lib/mongodb"; // Adjust path as needed

export async function GET() {
    await connectDB(); // Ensure the database connection is established

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email; // Assuming the email is stored in the session user
    
    try {
        // Find user by email
        const user = await User.findOne({ email: userEmail }).select("-password"); // Exclude password for security
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user); // Return user information as JSON
    } catch (error) {
        console.error("Error fetching user information:", error);
        return NextResponse.json({ error: "Failed to fetch user information" }, { status: 500 });
    }
}
