import User from "@/lib/models/user";
import connect from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connect();
        const users = await User.find();
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return new NextResponse(`Error fetching users: ${String(error)}`, { status: 500 });
    }
};

export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        await connect();
        const newUser = new User(body);
        await newUser.save();
        return NextResponse.json({ message: "User created", user: newUser }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return new NextResponse(`Error creating user: ${String(error)}`, { status: 500 });
    }
};