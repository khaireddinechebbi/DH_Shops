import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Products";
import User from "@/models/User";
import Notification from "@/models/Notification";

// GET all comments for a product
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const { id: productId } = params;

        const product = await Product.findById(productId)
            .populate('comments.user', 'name username image')
            .lean();

        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ comments: product.comments || [] }, { status: 200 });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json(
            { error: "Failed to fetch comments" },
            { status: 500 }
        );
    }
}

// POST a new comment
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
        const { text } = await req.json();

        if (!text || text.trim().length === 0) {
            return NextResponse.json(
                { error: "Comment text is required" },
                { status: 400 }
            );
        }

        // Get user
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Find product and add comment
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        const newComment = {
            user: user._id,
            text: text.trim(),
            date: new Date(),
        };

        product.comments.push(newComment);
        await product.save();

        // Create Notification if not commenting on own product
        if (product.ownerEmail !== user.email) {
            try {
                // Find owner to get ID
                const owner = await User.findOne({ email: product.ownerEmail });
                if (owner) {
                    await Notification.create({
                        recipient: owner._id,
                        sender: user._id,
                        type: 'comment',
                        product: product._id,
                        read: false
                    });
                }
            } catch (notifyError) {
                console.error("Error creating notification:", notifyError);
            }
        }

        // Populate the user data for the response
        await product.populate('comments.user', 'name username image');

        // Return the newly added comment directly
        const newlyAddedComment = product.comments[product.comments.length - 1];
        return NextResponse.json(newlyAddedComment, { status: 201 });
    } catch (error) {
        console.error("Error adding comment:", error);
        return NextResponse.json(
            { error: "Failed to add comment" },
            { status: 500 }
        );
    }
}
