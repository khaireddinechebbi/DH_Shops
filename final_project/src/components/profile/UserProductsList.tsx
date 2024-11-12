"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaPenSquare } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import ProductUpdate from "./ProductUpdate";

// Define the type for Product
interface Product {
  _id: string;
  title: string;
  images: string[];
  description: string;
  priceInCents: number;
  brand: string;
}

// Define the type for the API response
interface ProductsResponse {
  products: Product[];
}

// Function to fetch products
const getProducts = async (): Promise<ProductsResponse | null> => {
  try {
    const res = await fetch("http://localhost:3000/api/user/products", {
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

// Main ProductsList component
export default function UserProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // Track the selected product

  // Fetch products when the component mounts
  React.useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      if (data) setProducts(data.products);
    };

    fetchProducts();
  }, []);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product); // Set the selected product to show in the modal for updating
  };

  const handleCloseModal = () => {
    setSelectedProduct(null); // Close the modal by setting selectedProduct to null
  };

  const handleDelete = async (productId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/products/${productId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Filter out the deleted product from the products list
        setProducts((prevProducts) => prevProducts.filter((p) => p._id !== productId));
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };



  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map((product) => (
        <article key={product._id} className="overflow-hidden rounded-lg shadow transition hover:shadow-lg">
          <Image
            alt={product.title}
            src={product.images && product.images.length > 0 ? product.images[0] : "/fallback-image.jpg"} // Fallback image if no product image
            width={500}
            height={300}
            className="h-56 w-full rounded-xl object-cover shadow-xl transition group-hover:grayscale-[50%]"
          />
          <div className="p-4">
            <h2 className="mt-2 text-lg font-medium text-gray-900">{product.title}</h2>
            <p className="mt-2 text-sm text-gray-500">{product.brand}</p> {/* Display brand */}
            <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <p className="mt-2 text-lg font-semibold text-gray-800">
                ${(product.priceInCents / 100).toFixed(2)}
              </p>
              <div className="flex ">
                <button
                  className="mt-2 bg-white text-yellow-700 font-bold px-2 py-2 rounded-full hover:bg-yellow-700 hover:text-white transition"
                  onClick={() => handleProductClick(product)} // Open modal to update product details
                >
                  <FaPenSquare />
                </button>
                <button
                  className="mt-2 bg-white text-red-700 font-bold px-2 py-2 rounded-full hover:bg-red-700 hover:text-white transition"
                  onClick={() => handleDelete(product._id)} // Delete product
                >
                  <RiDeleteBin6Fill />
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}

      
      {selectedProduct && <ProductUpdate product={selectedProduct} onClose={handleCloseModal} />}
    </div>
  );
}
