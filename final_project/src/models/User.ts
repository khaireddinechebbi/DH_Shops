import { UserDocument } from "@/types/types";
import mongoose, { Schema, model } from "mongoose";

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
        phone: {
            type: String,
            required: false,
        },
        image: {
            type: [String],
            required: false,
        },
        address: {
            type: String,
            required: false
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
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
