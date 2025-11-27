import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const path = join(process.cwd(), "public", "uploads", fileName);

        // Write file to public/uploads
        await writeFile(path, buffer);

        const imageUrl = `/uploads/${fileName}`;

        // Update user's image in database
        const user = await User.findOneAndUpdate(
            { email: session.user.email },
            { image: [imageUrl] },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ imageUrl }, { status: 200 });
    } catch (error) {
        console.error("Error uploading profile image:", error);
        return NextResponse.json(
            { error: "Failed to upload image" },
            { status: 500 }
        );
    }
}
