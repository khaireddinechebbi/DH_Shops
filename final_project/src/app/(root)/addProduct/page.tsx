"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddProduct() {
    const [name, setName] = useState("");
    const [images, setImages] = useState<File | null>(null); // Changed to File type
    const [priceInCents, setPriceInCents] = useState("");
    const [description, setDescription] = useState("");
    const [sizes, setSizes] = useState("");
    const [category, setCategories] = useState("");

    const router = useRouter();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImages(e.target.files[0]); // Update the state with the selected image file
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !priceInCents || !sizes || !category) {
            alert("All fields are required");
            return;
        }

        try {
            // Use FormData to handle file uploads
            const formData = new FormData();
            formData.append("name", name);
            formData.append("priceInCents", priceInCents);
            formData.append("description", description);
            formData.append("sizes", sizes);
            formData.append("category", category);
            formData.append("images", images); // Append image file

            const res = await fetch("http://localhost:3000/api/products", {
                method: "POST",
                body: formData // Send the form data
            });

            if (res.ok) {
                router.push("/profile");
            } else {
                throw new Error("Failed to create a product");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h1>Add Product</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="priceInCents">Price (in cents):</label>
                    <input
                        type="number"
                        id="priceInCents"
                        value={priceInCents}
                        onChange={(e) => setPriceInCents(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="sizes">Sizes:</label>
                    <input
                        type="text"
                        id="sizes"
                        value={sizes}
                        onChange={(e) => setSizes(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="category">Category:</label>
                    <input
                        type="text"
                        id="category"
                        value={category}
                        onChange={(e) => setCategories(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="images">Image:</label>
                    <input
                        type="file"
                        id="images"
                        onChange={handleImageChange} // Add onChange handler for file input
                        required
                    />
                </div>
                <button type="submit">Add Product</button>
            </form>
        </div>
    );
}
