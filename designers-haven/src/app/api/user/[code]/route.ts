import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Products";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

        // Check if current user is following this user
        const session = await getServerSession(authOptions);
        let isFollowing = false;

        if (session?.user?.email) {
            const currentUser = await User.findOne({ email: session.user.email }).select('following');
            if (currentUser && currentUser.following) {
                isFollowing = currentUser.following.some((id: any) => id.toString() === user._id.toString());
            }
        }

        // Return public user data
        const userData = user as any;
        return NextResponse.json({
            _id: userData._id,
            name: userData.name,
            username: userData.username,
            bio: userData.bio,
            phone: userData.phone,
            address: userData.address,
            image: userData.image,
            coverImage: userData.coverImage,
            followersCount: userData.followers?.length || 0,
            followingCount: userData.following?.length || 0,
            products: userData.products || [],
            isFollowing, // Return follow status
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user by username:", error);
        return NextResponse.json(
            { error: "Failed to fetch user" },
            { status: 500 }
        );
    }
}
