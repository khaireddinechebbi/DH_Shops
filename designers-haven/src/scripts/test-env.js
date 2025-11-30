/* eslint-disable @typescript-eslint/no-require-imports */
const dotenv = require("dotenv");
const path = require("path");

console.log("Starting JS test script...");
console.log("Current dir:", process.cwd());
const envPath = path.resolve(process.cwd(), '.env.local');
console.log("Env path:", envPath);

const result = dotenv.config({ path: envPath });
if (result.error) {
    console.error("Error loading env:", result.error);
} else {
    console.log("Env loaded successfully");
}

console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Defined" : "Undefined");
console.log("Done.");
