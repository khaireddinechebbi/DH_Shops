"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ImageDocument } from "@/types/types";

interface Product {
  _id: string;
  title: string;
  sizes: string[];
  category: string;
  brand: string;
  sex: string;
  priceInCents: number;
  description: string;
  images: ImageDocument[];
}

interface ProductModalProps {
  productId: string;
  onClose: () => void;
}

export default function ProductUpdate({ productId, onClose }: ProductModalProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newSize, setNewSize] = useState<string>("");

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) return null;

  // Update product details
  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      const updatedProduct = await response.json();
      setProduct(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Add new image
  const handleAddImage = async (newImageUrl: string) => {
    if (product) {
      const updatedImages = [...product.images, { url: newImageUrl }];
      await handleUpdate({ ...product, images: updatedImages });
    }
  };

  // Delete an image
  const handleDeleteImage = async (index: number) => {
    if (product) {
      const updatedImages = product.images.filter((_, i) => i !== index);
      await handleUpdate({ ...product, images: updatedImages });
      setCurrentImageIndex(0);
    }
  };

  // Add new size
  const handleAddSize = () => {
    if (newSize && !product?.sizes.includes(newSize)) {
      setProduct({ ...product, sizes: [...product.sizes, newSize] });
      setNewSize("");
    }
  };

  // Delete a size
  const handleDeleteSize = (sizeToDelete: string) => {
    if (product) {
      const updatedSizes = product.sizes.filter(size => size !== sizeToDelete);
      setProduct({ ...product, sizes: updatedSizes });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] p-6 relative overflow-y-auto">
        <button onClick={onClose} className="absolute top-2 right-2 w-8 h-8 rounded-full text-red-600 hover:bg-red-600 hover:text-white">✕</button>

        {/* Product Images */}
        <div className="relative">
          <Image
            alt={product.title}
            src={product.images && product.images.length > 0 ? product.images[currentImageIndex].url : '/fallback-image.jpg'}
            width={300}
            height={300}
            className="h-65 w-full rounded-xl object-cover shadow-xl"
          />
          <button onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}>&lt;</button>
          <button onClick={() => setCurrentImageIndex((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}>&gt;</button>
        </div>

        {/* Product Details */}
        <h2>Title:</h2>
        <input
          type="text"
          value={product.title}
          onChange={(e) => setProduct({ ...product, title: e.target.value })}
        />
        <p>Brand: {product.brand}</p>
        <p>Price in cents: {(product.priceInCents / 100).toFixed(2)}</p>
        <input
          type="number"
          value={product.priceInCents / 100}
          onChange={(e) => setProduct({ ...product, priceInCents: +e.target.value * 100 })}
        />
        <h3>Description:</h3>
        <textarea
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
        />

        {/* Sizes */}
        <h3>Sizes:</h3>
        <ul>
          {product.sizes ? (
            product.sizes.map((size) => (
              <li key={size}>
                {size} <button onClick={() => handleDeleteSize(size)}>Delete</button>
              </li>
            ))
          ) : (
            <li>No sizes available.</li>
          )}
        </ul>
        <input
          type="text"
          value={newSize}
          onChange={(e) => setNewSize(e.target.value)}
          placeholder="Add new size"
        />
        <button onClick={handleAddSize}>Add Size</button>

        {/* Image Add/Delete */}
        <button onClick={() => handleAddImage("/new-image-url.jpg")}>Add Image</button>
        <button onClick={() => handleDeleteImage(currentImageIndex)}>Delete Image</button>

        {/* Save Changes */}
        <button onClick={handleUpdate}>Save Changes</button>
      </div>
    </div>
  );
}
