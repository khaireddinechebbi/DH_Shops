import { ProductDocument } from "@/types/types";
import mongoose, { Schema, model } from "mongoose";

const ProductSchema = new Schema<ProductDocument>(
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
            type: [String], // Array of strings for image URLs
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            
        },
        likes: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "User",
            default: []
        },
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                text: {
                    type: String,
                    required: true
                },
                date : {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

const Product = mongoose.models.Product || model<ProductDocument>("Product", ProductSchema);
export default Product;
