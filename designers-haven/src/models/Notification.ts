import mongoose, { Schema, Document } from "mongoose";

export interface NotificationDocument extends Document {
    recipient: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    type: 'follow' | 'like' | 'comment';
    product?: mongoose.Types.ObjectId; // Optional, for likes and comments
    read: boolean;
    createdAt: Date;
}

const NotificationSchema = new Schema<NotificationDocument>({
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['follow', 'like', 'comment'], required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// Create index for faster queries
NotificationSchema.index({ recipient: 1, createdAt: -1 });

const Notification = mongoose.models.Notification || mongoose.model<NotificationDocument>("Notification", NotificationSchema);

export default Notification;
