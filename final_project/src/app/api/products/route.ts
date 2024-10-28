import Product from "@/models/Products";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Retrieve user from the database using session email or ID
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const data = await request.formData();

        // Extracting the product fields
        const title = data.get("title") as string;
        const priceInCents = Number(data.get("priceInCents"));
        const description = data.get("description") as string;
        const sizes = data.getAll("sizes") as string[];
        const category = data.get("category") as string;
        const sex = data.get("sex") as string;
        const brand = data.get("brand") as string;
        
        // Handling file uploads
        const files = data.getAll("files");
        const imageUrls = [];

        for (const file of files) {
            if (file instanceof File) {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const fileName = `${Date.now()}-${file.name}`;
                const path = join(process.cwd(), "public", "uploads", fileName);

                // Write file to the public folder
                await writeFile(path, buffer);
                imageUrls.push(`/uploads/${fileName}`);
            }
        }

        // Create and save the product
        const product = new Product({
            title,
            priceInCents,
            description,
            sizes,
            category,
            ownerEmail: session.user.email,
            ownerName: session.user.name,
            sex,
            brand,
            images: imageUrls,
        });
        await product.save();

        // Update the user's product list
        user.products.push(product._id);
        await user.save();

        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}



export async function GET() {
    await connectDB();
    try {
        const products = await Product.find()
            .select("title priceInCents description sizes category images owner sex brand") // Include sex and brand
            .exec();

        return NextResponse.json({ products });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}