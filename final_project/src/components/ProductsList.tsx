"use client";

import { ProductDocuments, UserDocument } from "@/types/types"; // Adjust path accordingly
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

// Fetching user data by ID
const getUserById = async (userId: string): Promise<UserDocument | null> => {
    try {
        const res = await fetch(`http://localhost:3000/api/users/${userId}`);
        if (!res.ok) {
            throw new Error("Fetching user failed");
        }
        return res.json();
    } catch (error) {
        console.log("Error: ", error);
        return null; // Return null in case of an error
    }
}

const getProducts = async (): Promise<{ products: ProductDocuments[] }> => {
    try {
        const res = await fetch('http://localhost:3000/api/products', { cache: "no-store" });
        if (!res.ok) {
            throw new Error("Fetching products failed");
        }
        return res.json();
    } catch (error) {
        console.log("Error: ", error);
        return { products: [] };
    }
}

export default function ProductsList() {
    const [products, setProducts] = useState<ProductDocuments[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [owners, setOwners] = useState<{ [key: string]: UserDocument | null }>({});

    useEffect(() => {
        const fetchProducts = async () => {
            const { products } = await getProducts();
            setProducts(products);

            // Fetch owner details for each product
            const ownerPromises = products.map(async (product) => {
                const ownerData = await getUserById(product.owner.toString());
                return { id: product.owner.toString(), data: ownerData };
            });
            const ownerData = await Promise.all(ownerPromises);
            const ownersMap = ownerData.reduce((acc, { id, data }) => {
                acc[id] = data;
                return acc;
            }, {} as { [key: string]: UserDocument | null });
            setOwners(ownersMap);
        };

        fetchProducts();
    }, []);

    return (
        <>
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </>
    )
}
