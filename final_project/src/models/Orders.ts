import { CartDocument, CartItemDocument } from "@/types/types";
import mongoose, { Schema } from "mongoose";


const CartItemSchema = new Schema<CartItemDocument>({
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceInCents: { type: Number, required: true }
});

const CartSchema = new Schema<CartDocument>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [CartItemSchema],
    total_price: { type: Number, default: 0 },
});

const Cart = mongoose.model<CartDocument>("Cart", CartSchema);
export default Cart;