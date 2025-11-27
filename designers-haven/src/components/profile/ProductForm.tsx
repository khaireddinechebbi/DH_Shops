'use client';

import { useEffect, useState } from 'react';
import { ProductDocument } from '@/types/types';
import Image from 'next/image'; // Import the Image component

interface ProductFormProps {
  initialData?: ProductDocument | null;
  onProductAddedOrUpdated: () => void;
}

export default function ProductForm({ initialData, onProductAddedOrUpdated }: ProductFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [priceInCents, setPriceInCents] = useState(initialData?.priceInCents || 0);
  const [description, setDescription] = useState(initialData?.description || '');
  const [sizes, setSizes] = useState<string[]>(initialData?.sizes || []);
  const [sizeInput, setSizeInput] = useState('');
  const [category, setCategory] = useState(initialData?.category || '');
  const [sex, setSex] = useState(initialData?.sex || '');
  const [brand, setBrand] = useState(initialData?.brand || '');
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);


  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setPriceInCents(initialData.priceInCents);
      setDescription(initialData.description);
      setSizes(initialData.sizes);
      setCategory(initialData.category);
      setSex(initialData.sex);
      setBrand(initialData.brand);
      setExistingImages(initialData.images || []);
    } else {
      // Clear form for new product
      setTitle('');
      setPriceInCents(0);
      setDescription('');
      setSizes([]);
      setCategory('');
      setSex('');
      setBrand('');
      setNewImages([]);
      setExistingImages([]);
    }
  }, [initialData]);

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const handleRemoveExistingImage = (imageToRemove: string) => {
    setExistingImages(prev => prev.filter(img => img !== imageToRemove));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('priceInCents', String(priceInCents));
    formData.append('description', description);
    sizes.forEach((size) => {
      formData.append('sizes', size);
    });
    formData.append('category', category);
    formData.append('sex', sex);
    formData.append('brand', brand);

    // Append new images
    newImages.forEach((image) => {
      formData.append('files', image);
    });

    // Append existing images (their URLs)
    existingImages.forEach((imageUrl) => {
      formData.append('existingImages', imageUrl);
    });


    const method = initialData ? 'PUT' : 'POST';
    const url = initialData ? `/api/products/${initialData._id}` : '/api/products';

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Failed to ${initialData ? 'update' : 'add'} product.`);
      }

      // Clear form and call callback
      setTitle('');
      setPriceInCents(0);
      setDescription('');
      setSizes([]);
      setSizeInput('');
      setCategory('');
      setSex('');
      setBrand('');
      setNewImages([]);
      setExistingImages([]);
      onProductAddedOrUpdated(); // Notify parent component
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addSize = (e: React.FormEvent) => {
    e.preventDefault();
    if (sizeInput && !sizes.includes(sizeInput)) {
      setSizes((prevSizes) => [...prevSizes, sizeInput]);
      setSizeInput('');
    }
  };
  const deleteSize = (sizeToDelete: string) => {
    setSizes((prevSizes) => prevSizes.filter((size) => size !== sizeToDelete));
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="space-y-6 p-6 bg-white shadow-md rounded-md max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{initialData ? 'Edit Product' : 'Add a New Product'}</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Product title"
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        required
      />
      <input
        type="number"
        value={priceInCents}
        onChange={(e) => setPriceInCents(Number(e.target.value))}
        placeholder="Price (cents)"
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Product Description"
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        required
      />
      <div>
        <input
          type="text"
          value={sizeInput}
          onChange={(e) => setSizeInput(e.target.value)}
          placeholder="Add Size"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={addSize}
          className="p-3 bg-transparent font-semibold text-green-600 rounded-md hover:bg-green-600 hover:text-white transition"
        >
          Add Size
        </button>
        <ul className="space-y-2">
          {sizes.map((size, index) => (
            <li key={index}>
              {size}
              <button type="button" onClick={() => deleteSize(size)}
                className="text-red-600 font-semibold bg-transparent hover:text-white hover:bg-red-600">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        required
      />
      <select
        value={sex}
        onChange={(e) => setSex(e.target.value)}
        required
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        <option value="">Select Sex</option>
        <option value="men">Men</option>
        <option value="women">Women</option>
      </select>
      <input
        type="text"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        placeholder="Brand"
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        required
      />
      <div>
        <h4>Current Images:</h4>
        <div className="flex flex-wrap gap-2">
          {existingImages.map((image, index) => (
            <div key={index} className="relative w-24 h-24">
              <Image
                src={image}
                alt={`Product image ${index}`}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
              <button
                type="button"
                onClick={() => handleRemoveExistingImage(image)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
              >
                X
              </button>
            </div>
          ))}
        </div>
        <label htmlFor="new-images" className="block text-sm font-medium text-gray-700 mt-4">Upload New Images:</label>
        <input
          id="new-images"
          type="file"
          accept="image/*"
          onChange={handleNewImageChange}
          multiple
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <button type="submit"
        className="w-full p-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
      >
        {initialData ? 'Update Product' : 'Add Product'}
      </button>
    </form>
  );
}
