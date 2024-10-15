import User from "@/lib/models/user";
import connect from "@/lib/mongodb";
import { Types } from "mongoose";  // Import Types from mongoose
import { NextResponse } from "next/server";

// GET request to find a user by ID
export const GET = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        await connect();
        const { id } = params;

        // Validate the ObjectId format
        if (!Types.ObjectId.isValid(id)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid user ID format." }),
                { status: 400 }
            );
        }

        const user = await User.findById(id);

        if (!user) {
            return new NextResponse(
                JSON.stringify({ message: "User not found." }),
                { status: 404 }
            );
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return new NextResponse(`Error fetching user: ${String(error)}`, { status: 500 });
    }
};

// PATCH request to update a user's information
export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        const body = await request.json();
        await connect();

        // Validate the ObjectId format
        if (!Types.ObjectId.isValid(id)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid user ID format." }),
                { status: 400 }
            );
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { ...body },  // Use the request body to update user fields
            { new: true }
        );

        if (!updatedUser) {
            return new NextResponse(
                JSON.stringify({ message: "User not found." }),
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "User updated successfully.", user: updatedUser },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating user:", error);
        return new NextResponse(`Error updating user: ${String(error)}`, { status: 500 });
    }
};

// DELETE request to delete a user by ID
export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        await connect();

        // Validate the ObjectId format
        if (!Types.ObjectId.isValid(id)) {
            return new NextResponse(
                JSON.stringify({ message: "Invalid user ID format." }),
                { status: 400 }
            );
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return new NextResponse(
                JSON.stringify({ message: "User not found." }),
                { status: 404 }
            );
        }

        return new NextResponse(
            JSON.stringify({ message: "User deleted successfully.", user: deletedUser }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting user:", error);
        return new NextResponse(`Error deleting user: ${String(error)}`, { status: 500 });
    }
};
