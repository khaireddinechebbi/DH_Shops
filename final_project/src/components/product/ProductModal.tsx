"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { CommentDocument, ImageDocument } from '@/types/types';
import { useCart } from '@/context/CartContext';

// Define Product type
interface Product {
  _id: string;
  title: string;
  sizes: string[];
  category: string;
  brand: string;
  sex: string;
  priceInCents: number;
  description: string;
  ownerName: string;
  images: ImageDocument[];
  likes: string[];
  comments: CommentDocument[];
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const { addToCart } = useCart();

  const handleNext = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handlePrevious = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
      );
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }

    if (!product) {
      alert("Product not found.");
      return;
    }

    addToCart({
      productId: product._id,
      title: product.title,
      priceInCents: product.priceInCents,
      quantity,
      size: selectedSize,
    });

    alert("Product added to cart!");
    onClose();
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] p-6 relative overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full font-bold text-red-600 bg-transparent hover:bg-red-600 hover:text-white z-10">
          ✕
        </button>

        <div className="relative">
          <Image
            alt={product.title}
            src={product.images && product.images.length > 0 ? product.images[currentImageIndex] : '/fallback-image.jpg'}
            width={300}
            height={300}
            className="h-65 w-full rounded-xl object-cover shadow-xl transition"
          />

          <button
            onClick={handlePrevious}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600 hover:-translate-x-2"
          >
            &lt;
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600 hover:translate-x-2"
          >
            &gt;
          </button>
        </div>

        <div className="mt-4">
          <label htmlFor="size" className="block text-sm font-medium text-gray-700">Size</label>
          <select
            id="size"
            value={selectedSize || ''}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a size</option>
            {product.sizes.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            min={1}
          />
        </div>

        <div className="mt-4">
          <h2 className="text-2xl font-semibold">{product.title}</h2>
          <h3 className="text-gray-500">{product.brand}</h3>
          <p className="mt-2 text-sm text-gray-500">
            {product.ownerName}
          </p>
          <p className="text-lg font-bold mt-2">${(product.priceInCents / 100).toFixed(2)}</p>
          <p className="mt-2"><strong>Category:</strong> {product.category}</p>
          <p className="mt-2"><strong>Sex:</strong> {product.sex}</p>
          <p className="text-gray-700 mt-4">{product.description}</p>

          <button 
            onClick={handleAddToCart}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
