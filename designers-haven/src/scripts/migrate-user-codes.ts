import dotenv from "dotenv";
import path from "path";
import crypto from "crypto";

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
console.log("Loading env from:", envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
    console.error("Error loading .env.local:", result.error);
}

console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Defined" : "Undefined");

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Products";

function generateUserCode() {
    // Generate a random 8-character alphanumeric string
    return crypto.randomBytes(4).toString('hex');
}

async function migrateUserCodes() {
    try {
        await connectDB();
        console.log("Connected to database");

        // Find all users without userCode
        const users = await User.find({
            $or: [
                { userCode: { $exists: false } },
                { userCode: null },
                { userCode: "" }
            ]
        });

        console.log(`Found ${users.length} users without userCode`);

        const usedCodes = new Set<string>();

        // Get all existing codes
        const existingUsers = await User.find({ userCode: { $exists: true, $ne: null }, $and: [{ userCode: { $ne: "" } }] }).select('userCode');
        existingUsers.forEach(user => {
            if (user.userCode) {
                usedCodes.add(user.userCode);
            }
        });

        for (const user of users) {
            let code = generateUserCode();

            // Ensure uniqueness
            while (usedCodes.has(code)) {
                code = generateUserCode();
            }

            // Update user with new code
            user.userCode = code;
            await user.save();
            usedCodes.add(code);

            console.log(`Updated user ${user.email} with code: ${code}`);

            // Update all products owned by this user
            await Product.updateMany(
                { ownerEmail: user.email },
                { $set: { ownerCode: code } }
            );

            console.log(`Updated products for user ${code}`);
        }

        console.log("Migration completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrateUserCodes();
