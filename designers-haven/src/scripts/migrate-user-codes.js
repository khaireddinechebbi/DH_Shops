const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const crypto = require('crypto');

// Load env
const envPath = path.resolve(process.cwd(), '.env.local');
console.log("Loading env from:", envPath);
dotenv.config({ path: envPath });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Invalid/Missing environment variable: "MONGODB_URI"');
    process.exit(1);
}

// Define simplified schemas
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    userCode: { type: String, unique: true },
}, { strict: false }); // strict: false allows other fields to exist without being defined here

const productSchema = new mongoose.Schema({
    ownerEmail: { type: String, required: true },
    ownerCode: { type: String },
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

function generateUserCode() {
    return crypto.randomBytes(4).toString('hex');
}

async function migrate() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find users without userCode
        const users = await User.find({
            $or: [
                { userCode: { $exists: false } },
                { userCode: null },
                { userCode: "" }
            ]
        });

        console.log(`Found ${users.length} users without userCode`);

        // Get existing codes to ensure uniqueness
        const existingUsers = await User.find({ userCode: { $exists: true, $ne: null, $ne: "" } }).select('userCode');
        const usedCodes = new Set();
        existingUsers.forEach(u => {
            if (u.userCode) usedCodes.add(u.userCode);
        });

        for (const user of users) {
            let code = generateUserCode();
            while (usedCodes.has(code)) {
                code = generateUserCode();
            }

            user.userCode = code;
            await user.save();
            usedCodes.add(code);
            console.log(`Updated user ${user.email} with code: ${code}`);

            // Update products
            const result = await Product.updateMany(
                { ownerEmail: user.email },
                { $set: { ownerCode: code } }
            );
            console.log(`Updated ${result.modifiedCount} products for user ${code}`);
        }

        console.log('Migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
