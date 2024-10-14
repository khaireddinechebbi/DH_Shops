import mongoose, { Schema, model } from "mongoose";

export interface UserDocument {
    _id: string
    email: string
    password: string
    name: string
    phone: string
    image: string
    createAt: Date
    updateAt: Date
    products: mongoose.Types.ObjectId[]
    followers: mongoose.Types.ObjectId[]
    following: mongoose.Types.ObjectId[]
}

const UserSchema = new Schema<UserDocument> ({
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
    },
    {
        timestamps: true,
    }
)

const User = mongoose.models.User || model<UserDocument>('User', UserSchema)
export default User