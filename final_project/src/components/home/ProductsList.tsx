"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { ProductModal } from '../product/ProductModal';


// Define the type for Product
interface Product {
  _id: string;
  title: string;
  images: string[];
  description: string;
  priceInCents: number;
  brand: string;
  owner: string
}

// Define the type for the API response
interface ProductsResponse {
  products: Product[];
}

// Function to fetch products
const getProducts = async (): Promise<ProductsResponse | null> => {
  try {
    const res = await fetch('http://localhost:3000/api/products', {
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

// Main ProductsList component
export default function ProductsList() {
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
    setSelectedProduct(product); // Set the selected product to show in the modal
  };

  const handleCloseModal = () => {
    setSelectedProduct(null); // Close the modal by setting selectedProduct to null
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map((product) => (
        <article key={product._id} className="overflow-hidden rounded-lg shadow transition hover:shadow-lg">
          <Image
            alt={product.title}
            src={product.images && product.images.length > 0 ? product.images[0] : '/fallback-image.jpg'} // Fallback image if no product image
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
            <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
              {product.owner}
            </p>
            <div className='flex items-center justify-between'>
              <p className="mt-2 text-lg font-semibold text-gray-800">
                ${(product.priceInCents / 100).toFixed(2)}
              </p>
              <button
                className="mt-2 bg-white text-blue-700 text-extrabold px-4 py-2 rounded hover:bg-blue-700 hover:text-white transition"
                onClick={() => handleProductClick(product)} // Open modal with product details
              >
                View
              </button>
            </div>
          </div>
        </article>
      ))}

      {/* Render the modal if a product is selected */}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={handleCloseModal} />}
    </div>
  );
}
