'use client';

import { useState } from 'react';

export default function ProductForm() {
  const [title, setTitle] = useState('');
  const [priceInCents, setPriceInCents] = useState(0);
  const [images, setImages] = useState<File[]>([]); // Change to an array of Files
  const [description, setDescription] = useState('');
  const [sizes, setSizes] = useState<string>(''); // Comma-separated sizes
  const [category, setCategory] = useState('');

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
    formData.append('sizes', sizes); // Send sizes as a comma-separated string
    formData.append('category', category);
     // Replace with actual user ID

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

      // Reset form fields after successful upload
      setTitle('');
      setPriceInCents(0);
      setDescription('');
      setImages([]); // Reset images
      setSizes('');
      setCategory('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Product title"
        required
      />
      <input
        type="number"
        value={priceInCents}
        onChange={(e) => setPriceInCents(Number(e.target.value))}
        placeholder="Price (cents)"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Product Description"
        required
      />
      <input
        type="text"
        value={sizes}
        onChange={(e) => setSizes(e.target.value)}
        placeholder="Sizes (comma-separated)"
        required
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        multiple // Allow multiple file selection
        required
      />
      <button type="submit">Add Product</button>
    </form>
  );
}
