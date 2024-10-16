import { NextResponse } from "next/server";
import Product from "@/models/Products";
import { connectDB } from "@/lib/mongodb";

// GET: Fetch all products with owner name
export async function GET() {
    await connectDB();
    
    try {
        const products = await Product.find()
            .populate("owner", "name")  // Populate the owner field with the user's name
            .exec();

        return NextResponse.json({ products });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

// POST: Create a new product
export async function POST(request: Request) {
    await connectDB();
    const body = await request.json();
    console.log(body);
    try {
        const newProduct = new Product(body);
        await newProduct.save();

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}