import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Products";

export async function GET(
    req: NextRequest,
    { params }: { params: { username: string } }
) {
    try {
        await connectDB();

        const { username } = params;

        // Find user by username and populate products
        const user = await User.findOne({ username: username.toLowerCase() })
            .select('-password') // Exclude password
            .populate('products')
            .lean();

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Return public user data
        return NextResponse.json({
            _id: user._id,
            name: user.name,
            username: user.username,
            bio: user.bio,
            image: user.image,
            followersCount: user.followers?.length || 0,
            followingCount: user.following?.length || 0,
            products: user.products || [],
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user by username:", error);
        return NextResponse.json(
            { error: "Failed to fetch user" },
            { status: 500 }
        );
    }
}
