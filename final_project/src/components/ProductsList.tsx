import Image from 'next/image';
import React from 'react';

// Define the type for Product
interface Product {
  _id: string; // Assuming you have an ID field
  title: string;
  images: string[]; // Updated to match the API response
  description: string;
  priceInCents: number; // Price in cents
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
export default async function ProductsList() {
  const data = await getProducts();
  
  // If there is an error or no products, you might want to handle that
  if (!data || !data.products) {
    return <div>Error loading products</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.products.map((product) => (
        <article key={product._id} className="overflow-hidden rounded-lg shadow transition hover:shadow-lg">
          {/* Check if images exist and have at least one entry */}
          <Image
            alt={product.title}
            src={product.images && product.images.length > 0 ? product.images[0] : '/fallback-image.jpg'} // Fallback image if no product image
            width={500} // Set a width for the image
            height={300} // Set a height for the image
            className="h-56 w-full rounded-xl object-cover shadow-xl transition group-hover:grayscale-[50%]"
          />
          <div className="p-4">
            <h2 className="mt-2 text-lg font-medium text-gray-900">{product.title}</h2>
            <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
              {product.description}
            </p>
            <p className="mt-2 text-lg font-semibold text-gray-800">
              ${(product.priceInCents / 100).toFixed(2)} {/* Convert to dollars */}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
