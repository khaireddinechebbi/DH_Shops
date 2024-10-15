"use client"
import { useEffect, useState } from "react";
import { ProductDocuments } from "@/types/types"; // Adjust path as necessary

export default function UserProducts() {
    const [products, setProducts] = useState<ProductDocuments[]>([]);

    const fetchUserProducts = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/user-products"); // Adjust URL if necessary
            const data = await res.json();
            
            // Ensure data.products is an array before setting state
            if (Array.isArray(data.products)) {
                setProducts(data.products);
            } else {
                console.error("Unexpected data format:", data);
                setProducts([]); // Reset to an empty array if the response is invalid
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]); // Reset to an empty array if there's an error
        }
    };

    const handleDelete = async (productId: string) => {
        try {
            await fetch(`http://localhost:3000/api/products/${productId}`, {
                method: "DELETE",
            });
            setProducts((prevProducts) => prevProducts.filter(product => product._id !== productId));
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    useEffect(() => {
        fetchUserProducts();
    }, []);

    return (
        <div className="user-products">
            {products.length > 0 ? (
                products.map((product) => (
                    <div key={product._id}>
                        <h3>{product.name}</h3>
                        <button onClick={() => handleDelete(product._id)}>Delete</button>
                    </div>
                ))
            ) : (
                <p>No products found.</p>
            )}
        </div>
    );
}
