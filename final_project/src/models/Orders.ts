import { CartDocument } from '@/types/types';
import mongoose, { Schema, Document } from 'mongoose';


const CartItemSchema: Schema = new Schema({
  productId: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  size: { type: String, required: true },
});

const OrderSchema: Schema = new Schema({
  userEmail: { type: String, required: true }, // Using email instead of userId
  address: { type: String, required: true },
  items: [CartItemSchema],
  totalPrice: { type: Number, required: true },
},
{
  timestamps: true
});

const Order = mongoose.models.Order || mongoose.model<CartDocument & Document>('Order', OrderSchema);
export default Order
