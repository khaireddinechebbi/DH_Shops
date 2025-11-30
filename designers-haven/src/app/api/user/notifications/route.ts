import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import User from "@/models/User";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        // Get user ID
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Fetch notifications
        const notifications = await Notification.find({ recipient: user._id })
            .sort({ createdAt: -1 })
            .populate('sender', 'name username image')
            .populate('product', 'title images')
            .limit(20)
            .lean();

        return NextResponse.json({ notifications }, { status: 200 });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { error: "Failed to fetch notifications" },
            { status: 500 }
        );
    }
}

// Mark notifications as read
export async function PUT() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Mark all as read for now (can be refined to specific IDs)
        await Notification.updateMany(
            { recipient: user._id, read: false },
            { $set: { read: true } }
        );

        return NextResponse.json({ message: "Notifications marked as read" }, { status: 200 });
    } catch (error) {
        console.error("Error updating notifications:", error);
        return NextResponse.json(
            { error: "Failed to update notifications" },
            { status: 500 }
        );
    }
}
