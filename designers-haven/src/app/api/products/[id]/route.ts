import { NextResponse } from "next/server";
import Product from "@/models/Products";
import { connectDB } from "@/lib/mongodb";
import { NextRequest } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

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
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    await connectDB();

    try {
        const data = await request.formData();

        // Extracting the product fields
        const title = data.get("title") as string;
        const priceInCents = Number(data.get("priceInCents"));
        const description = data.get("description") as string;
        const sizes = data.getAll("sizes") as string[];
        const category = data.get("category") as string;
        const sex = data.get("sex") as string;
        const brand = data.get("brand") as string;
        const existingImages = data.getAll("existingImages") as string[]; // Get existing image URLs
        
        // Handling new file uploads
        const newFiles = data.getAll("files");
        const newImageUrls: string[] = [];

        for (const file of newFiles) {
            if (file instanceof File) {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const fileName = `${Date.now()}-${file.name}`;
                const path = join(process.cwd(), "public", "uploads", fileName);

                // Write file to the public folder
                await writeFile(path, buffer);
                newImageUrls.push(`/uploads/${fileName}`);
            }
        }

        const allImageUrls = [...existingImages, ...newImageUrls];

        const updatedProductData = {
            title,
            priceInCents,
            description,
            sizes,
            category,
            sex,
            brand,
            images: allImageUrls,
        };

        const updatedProduct = await Product.findByIdAndUpdate(id, updatedProductData, { new: true });

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
