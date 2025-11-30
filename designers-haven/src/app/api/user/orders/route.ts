import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Orders";

export async function GET() {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const testOrder = await Order.findOne(); // This line is just for testing
        console.log("Order test:", testOrder);
        const user = await User.findOne({ email: session.user.email }).populate("orders");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ orders: user.orders });
    } catch (error) {
        console.error("Error retrieving user orders:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to retrieve orders";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
