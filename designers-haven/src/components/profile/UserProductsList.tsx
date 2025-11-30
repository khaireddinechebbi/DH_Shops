"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaHeart, FaComment } from "react-icons/fa";
import { ProductDocument } from "@/types/types";
import { ProductModal } from "../product/ProductModal";

// Define the type for the API response
interface ProductsResponse {
  products: ProductDocument[];
}

// Function to fetch products
const getProducts = async (): Promise<ProductsResponse | null> => {
  try {
    const res = await fetch("/api/user/products", {
      cache: "no-cache",
    });

    if (!res.ok) {
      throw new Error("Failed fetching");
    }

    return res.json();
  } catch (err) {
    console.error(err);
    return null; // Return null on error
  }
};

interface UserProductsListProps {
  onEdit: (product: ProductDocument) => void;
  refreshProducts: () => void;
  onProductAddedOrUpdated: () => void;
  refreshTrigger: number;
  products?: ProductDocument[];
  isOwnProfile?: boolean;
}

// Main ProductsList component
export default function UserProductsList({
  onEdit,
  refreshProducts,
  refreshTrigger,
  products: initialProducts,
  isOwnProfile = true,
}: UserProductsListProps) {
  const [products, setProducts] = useState<ProductDocument[]>(initialProducts || []);
  const [selectedProduct, setSelectedProduct] = useState<ProductDocument | null>(null);

  // Fetch products when the component mounts or refreshTrigger changes, ONLY if initialProducts is not provided
  useEffect(() => {
    if (initialProducts) {
      setProducts(initialProducts);
      return;
    }

    const fetchProducts = async () => {
      const data = await getProducts();
      if (data) setProducts(data.products);
    };

    fetchProducts();
  }, [refreshTrigger, initialProducts]);

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Trigger refresh in parent
        refreshProducts();
        setSelectedProduct(null); // Close modal if open
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-1 md:gap-4 p-1 md:p-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="relative aspect-square group cursor-pointer overflow-hidden bg-gray-100"
            onClick={() => setSelectedProduct(product)}
          >
            <Image
              alt={product.title}
              src={product.images && product.images.length > 0 ? product.images[0] : "/fallback-image.jpg"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 text-white">
              <div className="flex items-center gap-2">
                <FaHeart className="text-xl" />
                <span className="font-bold">{product.likes?.length || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaComment className="text-xl" />
                <span className="font-bold">{product.comments?.length || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onEdit={isOwnProfile ? onEdit : undefined}
          onDelete={isOwnProfile ? handleDelete : undefined}
          onProductUpdate={refreshProducts}
        />
      )}
    </>
  );
}
