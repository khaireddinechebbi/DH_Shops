import React, { useState } from 'react';
import Image from 'next/image';
import { CommentDocument, ImageDocument, UserDocument } from '@/types/types';


// Update the Product type to match ProductDocument
interface Product {
  _id: string;
  title: string;
  sizes: string[]; // Available sizes
  category: string;
  brand: string;
  sex: string;
  priceInCents: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  owner: UserDocument; // Owner reference
  images: ImageDocument[]; // Images
  likes: string[]; // List of user IDs who liked the product
  comments: CommentDocument[]; // List of comments on the product
}

interface ProductModalProps {
  product: Product | null; // The product to display in the modal
  onClose: () => void; // Callback to close the modal
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

  // Handle next image
  const handleNext = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  // Handle previous image
  const handlePrevious = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
      );
    }
  };
  
    if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          ✕
        </button>

        {/* Product Images */}
        <div className="relative">
          {/* Display the current image */}
          <Image
            alt={product.title}
            src={product.images && product.images.length > 0 ? product.images[currentImageIndex] : '/fallback-image.jpg'}
            width={300}
            height={300}
            className="h-56 w-full rounded-xl object-cover shadow-xl transition"
          />

          {/* Left/Right Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
          >
            ←
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
          >
            →
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
        {/* Quantity Selector */}
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

        {/* Product Info */}
        <div className="mt-4">
          <h2 className="text-2xl font-semibold">{product.title}</h2>
          <p className="text-gray-500">{product.brand}</p>
          <p className="text-lg font-bold mt-2">${(product.priceInCents / 100).toFixed(2)}</p>
          
          {/* Category & Sex */}
          <p className="mt-2"><strong>Category:</strong> {product.category}</p>
          <p className="mt-2"><strong>Sex:</strong> {product.sex}</p>
          
          {/* Description */}
          <p className="text-gray-700 mt-4">{product.description}</p>


          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Buy Now</button>
        </div>
      </div>
    </div>
  );
};
