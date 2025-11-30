import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";

async function migrate() {
    try {
        const { connectDB } = await import("../lib/mongodb");
        const User = (await import("../models/User")).default;

        await connectDB();
        console.log("Connected to database");

        const users = await User.find({ username: { $exists: false } });
        console.log(`Found ${users.length} users without username`);

        for (const user of users) {
            const baseUsername = user.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
            let username = baseUsername;
            let counter = 1;

            while (await User.findOne({ username })) {
                username = `${baseUsername}${counter}`;
                counter++;
            }

            user.username = username;
            await user.save();
            console.log(`Updated user ${user.email} with username ${username}`);
        }

        console.log("Migration complete");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

migrate();
