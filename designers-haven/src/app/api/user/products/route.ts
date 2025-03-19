import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
    await connectDB();
    const session = await getServerSession(authOptions);
    console.log(session)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Find user by email and populate products
        const user = await User.findOne({ email: session.user.email }).populate("products");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ products: user.products });
    } catch (error) {
        console.error("Error retrieving user products:", error);
        return NextResponse.json({ error: "Failed to retrieve products" }, { status: 500 });
    }
}
