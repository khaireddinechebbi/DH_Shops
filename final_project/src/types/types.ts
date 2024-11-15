import mongoose from "mongoose";

// Interface for UserDocument
export interface UserDocument {
    _id: string;
    email: string;
    password: string;
    name: string;
    bio: string
    address: AddressDocument;
    phone?: string;
    image?: string[];
    createdAt: Date;
    updatedAt: Date;
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    products: ProductDocument[];
    orders: CartDocument[]
}

// Interface for AddressDocument
export interface AddressDocument {
    city: string;
    country: string;
    line1: string;
    line2: string;
    postal_code: string;
    state: string;
}

// Interface for ProductDocuments
export interface ProductDocument {
    _id: string;
    title: string;
    sizes: string[]; // An array of available sizes for the product
    category: string;
    brand: string;
    sex: string;
    priceInCents: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    ownerEmail: string;
    ownerName: string; // Owner reference
    images: ImageDocument[]; // Reflecting that images contain both ID and URL
    likes: mongoose.Types.ObjectId[]; // List of user IDs who liked the product
    comments: CommentDocument[]; // List of comments on the product
}

// Interface for images inside ProductDocument
export interface ImageDocument {
    _id: string;
    url: string;
}

// Interface for comments on the product
export interface CommentDocument {
    _id: string;
    user: mongoose.Schema.Types.ObjectId; // ID of the user who commented
    text: string;  // The comment text
    date: Date;    // Date of the comment
}

// Interface for CartItemDocument
export interface CartItem {
    productId: string;
    quantity: number;
    size: string;
    title: string;
    price: number;
}
  
export interface CartDocument extends Document {
    userEmail: string;
    address: string;
    items: CartItem[];
    totalPrice: number;
}
  

// Interface for CategoryDocument
export interface CategoryDocument {
    userId: mongoose.Types.ObjectId;
    user: UserDocument;
    title: string;
}
