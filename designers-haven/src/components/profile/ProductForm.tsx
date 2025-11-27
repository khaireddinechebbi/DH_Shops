'use client';

import { useEffect, useState } from 'react';
import { ProductDocument } from '@/types/types';
import Image from 'next/image';
import { FaPlus, FaTrash, FaCloudUploadAlt, FaSave } from 'react-icons/fa';

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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

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
      alert(`Failed to ${initialData ? 'update' : 'add'} product. Please try again.`);
    } finally {
      setLoading(false);
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
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold text-gray-900">
          {initialData ? 'Edit Product' : 'Add New Product'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Summer Dress"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Price (cents)</label>
          <input
            type="number"
            value={priceInCents}
            onChange={(e) => setPriceInCents(Number(e.target.value))}
            placeholder="e.g. 2999"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your product..."
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all min-h-[100px]"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Sizes</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={sizeInput}
            onChange={(e) => setSizeInput(e.target.value)}
            placeholder="Add Size (e.g. S, M, L)"
            className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
          <button
            onClick={addSize}
            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            <FaPlus />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {sizes.map((size, index) => (
            <span key={index} className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
              {size}
              <button
                type="button"
                onClick={() => deleteSize(size)}
                className="hover:text-purple-900 transition-colors"
              >
                <FaTrash size={12} />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Clothing"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Sex</label>
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value)}
            required
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          >
            <option value="">Select Sex</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Brand</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g. Nike"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-700 block">Product Images</label>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
            {existingImages.map((image, index) => (
              <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                <Image
                  src={image}
                  alt={`Product image ${index}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(image)}
                    className="p-2 bg-white text-red-500 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload New Images */}
        <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-purple-500 transition-colors text-center cursor-pointer bg-gray-50/50">
          <input
            id="new-images"
            type="file"
            accept="image/*"
            onChange={handleNewImageChange}
            multiple
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <FaCloudUploadAlt size={32} className="text-purple-500" />
            <span className="font-medium">Click to upload images</span>
            <span className="text-xs">JPG, PNG, GIF up to 10MB</span>
          </div>
        </div>

        {newImages.length > 0 && (
          <div className="text-sm text-green-600 font-medium">
            {newImages.length} new image(s) selected
          </div>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full p-4 bg-gradient-primary text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <FaSave />
              {initialData ? 'Update Product' : 'Create Product'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
