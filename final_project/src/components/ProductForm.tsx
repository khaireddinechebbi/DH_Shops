"use client";
import { useState } from "react";

export default function ProductForm() {
    const [name, setName] = useState("");
    const [priceInCents, setPriceInCents] = useState(0);
    const [image, setImage] = useState<File | null>(null);
    const [description, setDescription] = useState("");
    const [sizes, setSizes] = useState<string>(""); // Comma-separated sizes
    const [category, setCategory] = useState("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // FormData to handle file upload
        const formData = new FormData();
        formData.append("name", name);
        formData.append("priceInCents", String(priceInCents));
        formData.append("description", description);
        formData.append("sizes", sizes); // Send sizes as a comma-separated string
        formData.append("category", category);
        formData.append("ownerId", "YOUR_USER_ID"); // Replace with actual user ID
        if (image) {
            formData.append("image", image); // Assuming backend is set up to handle 'image' as a file
        }

        await fetch("/api/products", {
            method: "POST",
            body: formData,
        });

        // Reset form fields
        setName("");
        setPriceInCents(0);
        setDescription("");
        setImage(null);
        setSizes(""); // Reset sizes
        setCategory(""); // Reset category
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product Name"
                required
            />
            <input
                type="number"
                value={priceInCents}
                onChange={(e) => setPriceInCents(Number(e.target.value))}
                placeholder="Price (cents)"
                required
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product Description"
                required
            />
            <input
                type="text"
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                placeholder="Sizes (comma-separated)"
                required
            />
            <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category"
                required
            />
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
            />
            <button type="submit">Add Product</button>
        </form>
    );
}
