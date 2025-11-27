import { UserDocument } from "@/types/types";
import mongoose, { model, Schema } from "mongoose";

const AddressSchema = new Schema({
    city: String,
    country: String,
    line1: String,
    line2: String,
    postal_code: String,
    state: String,
}, { _id: false });

const UserSchema = new Schema<UserDocument>(
    {
        email: {
            type: String,
            unique: true,
            required: [true, "Email is required"],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Email is invalid",
            ],
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^[a-z0-9_]+$/,
                "Username can only contain lowercase letters, numbers, and underscores",
            ],
        },
        userCode: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        bio: {
            type: String,
            required: false,
        },
        phone: {
            type: String,
            required: false,
        },
        image: {
            type: [String],
            required: false,
        },
        coverImage: {
            type: String,
            required: false,
        },
        address: {
            type: AddressSchema,
            required: false,
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order"
            }
        ],
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const User = mongoose.models.User || model<UserDocument>("User", UserSchema);
export default User;
