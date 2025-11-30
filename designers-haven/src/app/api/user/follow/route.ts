import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Notification from "@/models/Notification";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { targetUserId } = await req.json();

        if (!targetUserId) {
            return NextResponse.json(
                { error: "Target user ID is required" },
                { status: 400 }
            );
        }

        // Get current user
        const currentUser = await User.findOne({ email: session.user.email });
        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get target user
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return NextResponse.json(
                { error: "Target user not found" },
                { status: 404 }
            );
        }

        // Check if already following
        const isFollowing = currentUser.following.some(
            (id: mongoose.Types.ObjectId) => id.toString() === targetUserId
        );

        if (isFollowing) {
            // Unfollow: remove from current user's following and target user's followers
            currentUser.following = currentUser.following.filter(
                (id: mongoose.Types.ObjectId) => id.toString() !== targetUserId
            );
            targetUser.followers = targetUser.followers.filter(
                (id: mongoose.Types.ObjectId) => id.toString() !== currentUser._id.toString()
            );
        } else {
            // Follow: add to current user's following and target user's followers
            currentUser.following.push(targetUserId);
            targetUser.followers.push(currentUser._id);

            // Create Notification
            try {
                await Notification.create({
                    recipient: targetUser._id,
                    sender: currentUser._id,
                    type: 'follow',
                    read: false
                });
            } catch (notifyError) {
                console.error("Error creating notification:", notifyError);
                // Don't fail the request if notification fails
            }
        }

        await currentUser.save();
        await targetUser.save();

        return NextResponse.json({
            isFollowing: !isFollowing,
            followersCount: targetUser.followers.length,
            followingCount: currentUser.following.length,
        }, { status: 200 });
    } catch (error) {
        console.error("Error toggling follow status:", error);
        return NextResponse.json(
            { error: "Failed to toggle follow status" },
            { status: 500 }
        );
    }
}
