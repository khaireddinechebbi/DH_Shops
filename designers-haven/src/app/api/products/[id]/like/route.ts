import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Products";
import User from "@/models/User";
import Notification from "@/models/Notification";
import mongoose from "mongoose";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { id: productId } = params;

        // Find product
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        // Get user to get their ID
        // const User = (await import("@/models/User")).default; // Removed shadowed import
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if user already liked the product
        const userIdString = user._id.toString();
        const isLiked = product.likes.some(
            (likeId: mongoose.Types.ObjectId) => likeId.toString() === userIdString
        );

        if (isLiked) {
            // Unlike
            product.likes = product.likes.filter(
                (id: mongoose.Types.ObjectId) => id.toString() !== user._id.toString()
            );
        } else {
            // Like
            product.likes.push(user._id);

            // Create Notification if not liking own product
            if (product.ownerEmail !== user.email) {
                try {
                    // Find owner to get ID
                    const owner = await User.findOne({ email: product.ownerEmail });
                    if (owner) {
                        await Notification.create({
                            recipient: owner._id,
                            sender: user._id,
                            type: 'like',
                            product: product._id,
                            read: false
                        });
                    }
                } catch (notifyError) {
                    console.error("Error creating notification:", notifyError);
                }
            }
        }

        await product.save();

        return NextResponse.json({
            isLiked: !isLiked,
            likesCount: product.likes.length,
        }, { status: 200 });
    } catch (error) {
        console.error("Error toggling like status:", error);
        return NextResponse.json(
            { error: "Failed to toggle like status" },
            { status: 500 }
        );
    }
}
