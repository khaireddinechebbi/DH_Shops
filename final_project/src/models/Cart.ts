import { CartDocument, CartItemDocument } from "@/types/types";
import mongoose, { Schema } from "mongoose";

// Define CartItem Schema
const CartItemSchema = new Schema<CartItemDocument>({
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    priceInCents: { type: Number, required: true }
});

// Define Cart Schema
const CartSchema = new Schema<CartDocument>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [CartItemSchema],
    total_price: { type: Number, default: 0 },
});

// Method to calculate total price
CartSchema.methods.calculateTotalPrice = function () {
    return this.items.reduce((total, item) => total + item.priceInCents * item.quantity, 0);
};

// Pre-save hook to update total price before saving
CartSchema.pre('save', function (next) {
    this.total_price = this.calculateTotalPrice();
    next();
});

// Export the model
const Cart = mongoose.model<CartDocument>("Cart", CartSchema);
export default Cart;
