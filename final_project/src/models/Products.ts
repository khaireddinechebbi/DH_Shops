import { ProductDocuments } from "@/types/types";
import mongoose, {Schema, model} from "mongoose";

const ProductSchema = new Schema<ProductDocuments>(
    {
        name: {
            type: String,
            required: true
        },
        image: [{
            type: String,
            required: true
        }],
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
            required:true
        },
        owner: [{
            type: mongoose.Types.ObjectId,
            ref: "User"
        }]
    },
    {
        timestamps: true
    }
)

const Product = mongoose.models.Product || model<ProductDocuments>("Product", ProductSchema)
export default Product