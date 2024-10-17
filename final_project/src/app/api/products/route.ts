import Product from "@/models/Products";
import { connectDB } from "@/lib/mongodb";
import formidable from "formidable";
import { NextRequest, NextResponse } from "next/server";


export const config = {
    api: {
        bodyParser: false,
    },
};

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
export async function POST(req: NextRequest) {
    await connectDB();

    const form = new formidable.IncomingForm();

    // Use a promise to handle the parsing of the form data
    return new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error("Error parsing the files:", err);
                return reject(NextResponse.json({ error: "Error parsing the files" }, { status: 400 }));
            }

            // Extract fields from the parsed data
            const { name, priceInCents, description, sizes, category, ownerId } = fields;

            // Handle the uploaded file
            const imageFile = files.image; // Assuming the field name for the image is 'image'
            const imagePath = imageFile ? imageFile.filepath : null; // Use the file path provided by formidable

            try {
                const newProductData = {
                    title: name,
                    priceInCents: Number(priceInCents),
                    description,
                    sizes: sizes.split(","), // Assuming sizes are sent as a comma-separated string
                    category,
                    ownerId,
                    image: imagePath, // File path for the uploaded image
                };

                const newProduct = new Product(newProductData);
                await newProduct.save();

                // Resolve with the new product data
                resolve(NextResponse.json(newProduct, { status: 201 }));
            } catch (error) {
                console.error("Error saving product:", error);
                reject(NextResponse.json({ error: "Failed to create product" }, { status: 500 }));
            }
        });
    });
}
