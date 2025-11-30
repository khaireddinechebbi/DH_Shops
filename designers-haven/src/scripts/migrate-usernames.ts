import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Products";

async function migrateUsernames() {
    try {
        await connectDB();
        console.log("Connected to database");

        // Find all users without usernames
        const usersWithoutUsername = await User.find({
            $or: [
                { username: { $exists: false } },
                { username: null },
                { username: "" }
            ]
        });

        console.log(`Found ${usersWithoutUsername.length} users without usernames`);

        const usedUsernames = new Set<string>();

        // Get all existing usernames to avoid conflicts
        const existingUsers = await User.find({ username: { $exists: true, $ne: null }, $and: [{ username: { $ne: "" } }] }).select('username');
        existingUsers.forEach(user => {
            if (user.username) {
                usedUsernames.add(user.username.toLowerCase());
            }
        });

        for (const user of usersWithoutUsername) {
            // Generate username from email (part before @)
            let baseUsername = user.email.split('@')[0].toLowerCase();

            // Remove any characters that aren't allowed
            baseUsername = baseUsername.replace(/[^a-z0-9_]/g, '_');

            // Ensure it doesn't start with a number
            if (/^\d/.test(baseUsername)) {
                baseUsername = 'user_' + baseUsername;
            }

            let username = baseUsername;
            let counter = 1;

            // Handle conflicts by appending numbers
            while (usedUsernames.has(username)) {
                username = `${baseUsername}${counter}`;
                counter++;
            }

            // Update user with new username
            user.username = username;
            await user.save();
            usedUsernames.add(username);

            console.log(`Updated user ${user.email} with username: ${username}`);

            // Update all products owned by this user to include ownerUsername
            await Product.updateMany(
                { ownerEmail: user.email },
                { $set: { ownerUsername: username } }
            );

            console.log(`Updated products for user ${username}`);
        }

        console.log("Migration completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrateUsernames();
