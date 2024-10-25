'use client';

import { useState } from 'react';

export default function ProductForm() {
  const [title, setTitle] = useState('');
  const [priceInCents, setPriceInCents] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [description, setDescription] = useState('');
  const [sizes, setSizes] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState('');
  const [category, setCategory] = useState('');
  const [sex, setSex] = useState('');
  const [brand, setBrand] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Convert the FileList to an array and update state
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // FormData to handle file uploads
    const formData = new FormData();
    formData.append('title', title);
    formData.append('priceInCents', String(priceInCents));
    formData.append('description', description);
    sizes.forEach((size) => {
      formData.append('sizes', size);
    }); // Send sizes as a comma-separated string
    formData.append('category', category);
    formData.append('sex', sex); // Append sex to formData
    formData.append('brand', brand); // Append brand to formData
    // Replace with actual user ID if needed
    // formData.append('ownerId', userId); // Uncomment and use actual user ID

    // Append each image file to the FormData
    images.forEach((image) => {
      formData.append('files', image); // Use 'files' to match the backend's field
    });

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      // Handle the response
      if (!res.ok) {
        throw new Error('Failed to upload product.');
      }

      setTitle('');
      setPriceInCents(0);
      setDescription('');
      setImages([]);
      setSizes([]);
      setSizeInput('');
      setCategory('');
      setSex('');
      setBrand('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addSize = (e: React.FormEvent) => {
    e.preventDefault();
    if (sizeInput) {
      setSizes((prevSizes) => [...prevSizes, sizeInput]); // Add size to the array
      setSizeInput(''); // Clear input after adding
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
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add a New Product</h2>
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
          placeholder="Add"
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
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        multiple
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        required
      />
      <button type="submit"
      className="w-full p-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
      >
        Add Product
      </button>
    </form>
  );
}
