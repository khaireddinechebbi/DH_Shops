"use client"
import React, { useState } from 'react';
import { ProductModal } from '../product/ProductModal';
import ProductCard from '../product/ProductCard';
import { ProductDocument } from '@/types/types';


// Define the type for the API response
interface ProductsResponse {
  products: ProductDocument[];
}

// Function to fetch products
const getProducts = async (): Promise<ProductsResponse | null> => {
  try {
    const res = await fetch('/api/products', {
      cache: 'no-cache',
    });

    if (!res.ok) {
      throw new Error('Failed fetching');
    }

    return res.json();
  } catch (err) {
    console.error(err);
    return null; // Return null on error
  }
};

interface ProductsListProps {
  products: ProductDocument[];
  onRefresh?: () => void; // Callback to refresh products
}

export default function ProductsList({ products, onRefresh }: ProductsListProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductDocument | null>(null); // Track the selected product

  const handleProductClick = (product: ProductDocument) => {
    setSelectedProduct(product); // Set the selected product to show in the modal
  };

  const handleCloseModal = () => {
    setSelectedProduct(null); // Close the modal by setting selectedProduct to null
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6 max-w-7xl mx-auto">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onProductClick={handleProductClick}
        />
      ))}

      {/* Render the modal if a product is selected */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onProductUpdate={onRefresh}
        />
      )}
    </div>
  );
}
