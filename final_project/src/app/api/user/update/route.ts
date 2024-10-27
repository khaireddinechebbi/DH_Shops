import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function PUT(req: Request) {
    await connectDB();

    const session = await getServerSession(authOptions);
    console.log(session);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { phone, address, userEmail } = await req.json();

    try {
        // Find user by email
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Update fields if new values are provided
        user.phone = phone || user.phone;
        user.address = address || user.address;

        await user.save();

        return NextResponse.json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating user profile:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
