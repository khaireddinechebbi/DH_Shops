import mongoose, { model } from "mongoose"

const productSchema = mongoose.Schema(
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
            type: [String],
            required: true
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

const Product = mongoose.models.Product || model("Product", productSchema);
export default Product;