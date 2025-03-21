import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Orders";


// POST method to handle order submission
export async function POST(request: Request) {
  // Connect to the database
  await connectDB();
  const session = await getServerSession(authOptions);

  // Check for authenticated user
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find the user based on their email
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse order details from the request body
    const { items, address, totalPrice } = await request.json();

    // Validate order details
    if (!items || items.length === 0 || !address || totalPrice === undefined) {
      return NextResponse.json({ error: "Missing required order details" }, { status: 400 });
    }

    // Create a new order document
    const newOrder = new Order({
      userEmail: session.user.email,
      address,
      items,  // items should match the structure of CartItemSchema
      totalPrice,
    });

    // Save the order to the database
    await newOrder.save();

    // Add the new order's ID to the user's orders array and save user
    user.orders.push(newOrder._id);
    await user.save();

    // Return success response with the order ID
    return NextResponse.json(
      { message: "Order placed successfully", orderId: newOrder._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting order:", error);
    return NextResponse.json({ error: "Failed to submit order" }, { status: 500 });
  }
}
