import { CategoryDocument } from "@/types/types";
import mongoose, { Schema, Types, model } from "mongoose";

const categorySchema = new Schema<CategoryDocument>(
    {
        title: {
            type: String,
            required: true,
        },
        user: {
            type: Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

const Category = mongoose.models.Category || model<CategoryDocument>("Category", categorySchema);
export default Category;
