"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaPenSquare } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { ProductDocument } from "@/types/types";

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
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <article
          key={product._id}
          className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white"
        >
          <div className="relative h-64 w-full overflow-hidden">
            <Image
              alt={product.title}
              src={product.images && product.images.length > 0 ? product.images[0] : "/fallback-image.jpg"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="p-5">
            <h2 className="text-lg font-display font-semibold text-gray-900 line-clamp-1 mb-1">
              {product.title}
            </h2>
            <p className="text-sm text-gray-500 font-medium mb-2">{product.brand}</p>
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
              {product.description}
            </p>

            {/* Price Display */}
            <div className="mb-4">
              <p className="text-2xl font-display font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ${(product.priceInCents / 100).toFixed(2)}
              </p>
            </div>

            {/* Action Buttons */}
            {isOwnProfile && (
              <div className="flex gap-2 pt-3 border-t">
                <button
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                  onClick={() => {
                    // Open product details modal or navigate to product page
                    window.open(`/product/${product._id}`, '_blank');
                  }}
                >
                  View Details
                </button>
                <button
                  className="p-2.5 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-gradient-primary hover:text-white transition-all transform hover:scale-110"
                  onClick={() => onEdit(product)}
                  aria-label="Edit product"
                >
                  <FaPenSquare size={18} />
                </button>
                <button
                  className="p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all transform hover:scale-110"
                  onClick={() => handleDelete(product._id)}
                  aria-label="Delete product"
                >
                  <RiDeleteBin6Fill size={18} />
                </button>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
