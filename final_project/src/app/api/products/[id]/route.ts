import { NextResponse } from "next/server";
import Product from "@/models/Products";
import { connectDB } from "@/lib/mongodb";

// GET: Fetch a single product by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    await connectDB();

    try {
        const product = await Product.findById(id);
        
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
    }
}

// PUT: Update a product by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    await connectDB();

    try {
        const updateData = await request.json();
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedProduct) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

// DELETE: Delete a product by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    await connectDB();

    try {
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Product deleted" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
