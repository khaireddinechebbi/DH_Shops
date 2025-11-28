"use client";
import { useState } from "react";
import ProductShowcase from "./ProductShowcase";
import { ProductDocument } from "@/types/types";

interface ProductShowcaseWrapperProps {
    initialProducts: ProductDocument[];
}

export default function ProductShowcaseWrapper({ initialProducts }: ProductShowcaseWrapperProps) {
    const [products, setProducts] = useState(initialProducts);

    const refreshProducts = async () => {
        try {
            const res = await fetch('/api/products', { cache: 'no-cache' });
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products || []);
            }
        } catch (error) {
            console.error("Error refreshing products:", error);
        }
    };

    return <ProductShowcase products={products} onRefresh={refreshProducts} />;
}
