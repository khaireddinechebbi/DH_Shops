import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
    try {
        await connectDB();
        const users = await User.find({ username: { $exists: false } });

        const results = [];

        for (const user of users) {
            let baseUsername = user.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
            let uniqueUsername = baseUsername;
            let counter = 1;

            while (await User.findOne({ username: uniqueUsername })) {
                uniqueUsername = `${baseUsername}${counter}`;
                counter++;
            }

            user.username = uniqueUsername;
            await user.save();
            results.push({ email: user.email, username: uniqueUsername });
        }

        return NextResponse.json({
            message: "Migration completed",
            migratedCount: results.length,
            details: results
        });
    } catch (error) {
        console.error("Migration error:", error);
        return NextResponse.json({ error: "Migration failed" }, { status: 500 });
    }
}
