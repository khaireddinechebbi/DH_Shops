"use client"
import { useEffect, useState } from "react";
import { ProductDocument } from "@/types/types";

interface UserProductsProps {
    onEdit: (product: ProductDocument) => void;
    refreshProducts: () => void;
    refreshTrigger: number; // Add this prop
}

export default function UserProducts({ onEdit, refreshProducts, refreshTrigger }: UserProductsProps) {
    const [products, setProducts] = useState<ProductDocument[]>([]);

    const fetchUserProducts = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/user/products"); // Adjust URL if necessary
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
            // After successful deletion, refresh the list
            refreshProducts(); // This will increment the refreshTrigger in page.tsx
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    useEffect(() => {
        fetchUserProducts();
    }, [refreshTrigger]); // Now depends on refreshTrigger

    return (
        <div className="user-products">
            {products.length > 0 ? (
                products.map((product) => (
                    <div key={product._id} className="border p-4 mb-4 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                        <p className="text-gray-700 mb-2">{product.description}</p>
                        <p className="text-gray-900 font-bold mb-2">${(product.priceInCents / 100).toFixed(2)}</p>
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => onEdit(product)} 
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => handleDelete(product._id)} 
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">No products found.</p>
            )}
        </div>
    );
}
