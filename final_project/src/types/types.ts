import mongoose from "mongoose";


export interface UserDocument {
    _id: string;
    email: string;
    password: string;
    name: string;
    address: AddressDocument
    phone?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
    products: mongoose.Types.ObjectId[];
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
}

export interface AddressDocument {
    city: string;
    country: string;
    line1: string;
    line2: string;
    postal_code: string;
    state: string;
}

export interface ProductDocuments {
    _id: string
    name: string
    sizes: [string]
    image: [string]
    category: string
    purchased: boolean
    priceInCents: number
    description: string
    createAt: Date
    updateAt: Date
    ownerId: mongoose.Types.ObjectId
    owner: UserDocument
}

export interface CartItemDocument extends Document {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    priceInCents: number;
}

export interface CartDocument extends Document {
    userId: mongoose.Types.ObjectId;
    items: CartItemDocument[];
    total_price: number;
}

export interface CategoryDocument {
    userId: mongoose.Types.ObjectId,
    user: UserDocument,
    title: string
}