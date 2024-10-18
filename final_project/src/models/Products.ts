import { ProductDocuments } from "@/types/types";
import mongoose, { Schema, model } from "mongoose";

const ProductSchema = new Schema<ProductDocuments>(
    {
        title: {
            type: String,
            required: true
        },
        priceInCents: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        sizes: {
            type: [String],
            required: true
        },
        category: {
            type: String,
            required: true
        },
        images: {
            type: [String],  // Store image URLs or paths
            required: false
        },
        owner: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.models.Product || model<ProductDocuments>("Product", ProductSchema);
export default Product;
