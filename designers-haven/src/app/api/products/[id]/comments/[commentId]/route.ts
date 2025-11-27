import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Products";
import User from "@/models/User";

// DELETE a comment
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string; commentId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { id: productId, commentId } = params;

        // Get user
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Find product
        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        // Find the comment
        const commentIndex = product.comments.findIndex(
            (comment) => comment._id.toString() === commentId
        );

        if (commentIndex === -1) {
            return NextResponse.json(
                { error: "Comment not found" },
                { status: 404 }
            );
        }

        // Check if user owns the comment
        if (product.comments[commentIndex].user.toString() !== user._id.toString()) {
            return NextResponse.json(
                { error: "You can only delete your own comments" },
                { status: 403 }
            );
        }

        // Remove the comment
        product.comments.splice(commentIndex, 1);
        await product.save();

        return NextResponse.json(
            { message: "Comment deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting comment:", error);
        return NextResponse.json(
            { error: "Failed to delete comment" },
            { status: 500 }
        );
    }
}
