import { CategoryDocument } from "@/types/types";
import mongoose, { Schema, Types, model } from "mongoose"; // Correct import for mongoose

const categorySchema = new Schema<CategoryDocument>(
    {
        title: {
            type: String,
            required: true,
        },
        user: {
            type: Types.ObjectId, // Corrected the position of the user field
            ref: "User", // Use the string representation of the model name
        },
    },
    {
        timestamps: true, // Optionally add timestamps for createdAt and updatedAt
    }
);

// Create and export the model
const Category = mongoose.models.Category || model<CategoryDocument>("Category", categorySchema);
export default Category;
