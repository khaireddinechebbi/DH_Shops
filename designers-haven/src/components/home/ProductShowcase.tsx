"use client";
import React, { useState, useMemo } from 'react';
import { ProductDocument } from '@/types/types';
import ProductsList from './ProductsList';
import { FaFilter, FaTimes } from 'react-icons/fa';

interface ProductShowcaseProps {
    products: ProductDocument[];
    onRefresh?: () => void;
}

export default function ProductShowcase({ products, onRefresh }: ProductShowcaseProps) {
    const [filters, setFilters] = useState({
        category: '',
        brand: '',
        size: '',
        sex: '',
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Extract unique values for filters
    const categories = useMemo(() => [...new Set(products.map(p => p.category))].filter(Boolean).sort(), [products]);
    const brands = useMemo(() => [...new Set(products.map(p => p.brand))].filter(Boolean).sort(), [products]);
    const sizes = useMemo(() => [...new Set(products.flatMap(p => p.sizes))].filter(Boolean).sort(), [products]);
    const sexes = useMemo(() => [...new Set(products.map(p => p.sex))].filter(Boolean).sort(), [products]);

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            if (filters.category && product.category !== filters.category) return false;
            if (filters.brand && product.brand !== filters.brand) return false;
            if (filters.sex && product.sex !== filters.sex) return false;
            if (filters.size && !product.sizes.includes(filters.size)) return false;
            return true;
        });
    }, [products, filters]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({ category: '', brand: '', size: '', sex: '' });
    };

    const activeFiltersCount = Object.values(filters).filter(Boolean).length;

    return (
        <div>
            {/* Filter Bar */}
            <div className="mb-8">
                <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-700 font-semibold">
                        <FaFilter className="text-purple-600" />
                        <span>Filters</span>
                        {activeFiltersCount > 0 && (
                            <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
                                {activeFiltersCount}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3 flex-1 justify-end">
                        {/* Category Filter */}
                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="px-4 py-2 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-purple-500 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>

                        {/* Brand Filter */}
                        <select
                            value={filters.brand}
                            onChange={(e) => handleFilterChange('brand', e.target.value)}
                            className="px-4 py-2 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-purple-500 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                        >
                            <option value="">All Brands</option>
                            {brands.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>

                        {/* Sex Filter */}
                        <select
                            value={filters.sex}
                            onChange={(e) => handleFilterChange('sex', e.target.value)}
                            className="px-4 py-2 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-purple-500 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                        >
                            <option value="">All Genders</option>
                            {sexes.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        {/* Size Filter */}
                        <select
                            value={filters.size}
                            onChange={(e) => handleFilterChange('size', e.target.value)}
                            className="px-4 py-2 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-purple-500 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition"
                        >
                            <option value="">All Sizes</option>
                            {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>

                        {/* Clear Filters */}
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition text-sm font-medium"
                            >
                                <FaTimes />
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Products List */}
            <ProductsList products={filteredProducts} onRefresh={onRefresh} />
        </div>
    );
}
