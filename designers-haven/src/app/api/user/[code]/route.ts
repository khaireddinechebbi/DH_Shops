import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Products";

export async function GET(
    req: NextRequest,
    { params }: { params: { code: string } }
) {
    try {
        await connectDB();

        const { code } = params;

        // Find user by userCode or username (fallback)
        const user = await User.findOne({
            $or: [
                { userCode: code },
                { username: code.toLowerCase() }
            ]
        })
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
        const userData = user as any;
        return NextResponse.json({
            _id: userData._id,
            name: userData.name,
            username: userData.username,
            bio: userData.bio,
            image: userData.image,
            followersCount: userData.followers?.length || 0,
            followingCount: userData.following?.length || 0,
            products: userData.products || [],
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user by username:", error);
        return NextResponse.json(
            { error: "Failed to fetch user" },
            { status: 500 }
        );
    }
}
