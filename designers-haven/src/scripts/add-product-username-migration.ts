import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";

async function migrate() {
    try {
        const { connectDB } = await import("../lib/mongodb");
        const Product = (await import("../models/Products")).default;
        const User = (await import("../models/User")).default;

        await connectDB();
        console.log("Connected to database");

        // Find all products without ownerUsername
        const products = await Product.find({ ownerUsername: { $exists: false } });
        console.log(`Found ${products.length} products without ownerUsername`);

        for (const product of products) {
            // Find the user by email
            const user = await User.findOne({ email: product.ownerEmail });

            if (user && user.username) {
                product.ownerUsername = user.username;
                await product.save();
                console.log(`Updated product ${product._id} with ownerUsername ${user.username}`);
            } else {
                console.warn(`Could not find user or username for product ${product._id} with ownerEmail ${product.ownerEmail}`);
            }
        }

        console.log("Migration complete");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

migrate();
