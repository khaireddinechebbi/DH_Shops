import Product from "@/models/Products";
import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

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

// POST: Create a new product
export async function POST(request: NextRequest) {
    await connectDB();
    const data = await request.formData();

    // Extracting the product fields
    const title = data.get('title') as string;
    const priceInCents = Number(data.get('priceInCents'));
    const description = data.get('description') as string;
    const sizes = data.getAll('sizes') as string[];
    const category = data.get('category') as string;
    
    const sex = data.get('sex') as string; // New field for sex
    const brand = data.get('brand') as string; // New field for brand

    // Handling the file uploads
    const files = data.getAll('files'); // Use getAll to get an array of files
    const imageUrls = []; // Array to store image URLs

    // Process each file
    for (const file of files) {
        if (file instanceof File) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const fileName = `${Date.now()}-${file.name}`; // Generate unique filename
            const path = join(process.cwd(), 'public', 'uploads', fileName); // Save in public/uploads/
            
            // Write file to the public folder
            await writeFile(path, buffer);
            
            // Generate the relative URL to the image
            imageUrls.push(`/uploads/${fileName}`); // Add the image URL to the array
        }
    }

    // Debugging logs
    console.log('Product details:', {
        title,
        priceInCents,
        description,
        sizes,
        category,
        
        sex, // Log the sex
        brand, // Log the brand
        imageUrls,
    });

    try {
        // Create a new product and save it in the database
        const product = new Product({
            title,
            priceInCents,
            description,
            sizes,
            category,
            
            sex, // Save the sex
            brand, // Save the brand
            images: imageUrls, // Save the array of image URLs
        });

        await product.save();
        console.log('Product saved:', product);
        console.log('Image URLs:', imageUrls);

        return NextResponse.json({ success: true, product });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}