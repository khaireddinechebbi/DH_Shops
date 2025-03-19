import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function PUT(req: Request) {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, bio, address, phone, userEmail } = await req.json();

    try {
        // Find user by email
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Update fields if new values are provided
        user.name = name || user.name;
        user.bio = bio || user.bio;
        user.phone = phone || user.phone;

        // Initialize user.address if it doesn't exist
        if (!user.address) {
            user.address = {};
        }

        // Update address fields if provided
        if (address) {
            user.address = {
                city: address.city || user.address.city,
                country: address.country || user.address.country,
                line1: address.line1 || user.address.line1,
                line2: address.line2 || user.address.line2,
                postal_code: address.postal_code || user.address.postal_code,
                state: address.state || user.address.state,
            };
        }

        await user.save();

        return NextResponse.json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating user profile:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
