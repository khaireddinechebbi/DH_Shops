import multer from 'multer';
import path from 'path';
import Product from "../models/product.model.js";

// Setup Multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/products');  // Specify the folder for product images
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },  // Limit to 5MB per file
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed (jpeg, jpg, png)'));
        }
    }
});

export const uploadProductImages = upload.array('images', 5);  // Max 5 images

// Controller to create a new product
export const createProduct = async (req, res) => {
    try {
        // Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Please upload at least one image' });
        }

        // Map uploaded file paths into an array
        const imagePaths = req.files.map(file => `/uploads/products/${file.filename}`);

        // Create product with the uploaded image paths
        const body = { ...req.body, images: imagePaths };
        const newProduct = new Product(body);
        await newProduct.save();

        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: "Failed to create product" });
    }
};

export const getProduct = async (req, res) => {
    try {
        const products = await Product.find().populate("owner", "name");  // Adjust population if necessary
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
}

export const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await findById(id).populate("owner", "name");
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Failed to fetch product" });
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    try {
        const product = await findByIdAndUpdate(id, body, { new: true });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Failed to update product" });
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json({ message: "Product deleted" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Failed to delete product" });
    }
}
