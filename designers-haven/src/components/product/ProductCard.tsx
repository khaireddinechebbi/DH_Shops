"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa";
import { ProductDocument } from "@/types/types";
import { useSession } from "next-auth/react";

interface ProductCardProps {
    product: ProductDocument;
    onProductClick: (product: ProductDocument) => void;
    children?: React.ReactNode; // For extra actions like Edit/Delete
}

export default function ProductCard({ product, onProductClick, children }: ProductCardProps) {
    const { data: session } = useSession();
    const [isLiked, setIsLiked] = useState(product.isLiked || false);
    const [likesCount, setLikesCount] = useState(product.likesCount || 0);
    const [commentsCount, setCommentsCount] = useState(product.commentsCount || 0);

    // Update state when product prop changes
    useEffect(() => {
        setIsLiked(product.isLiked || false);
        setLikesCount(product.likesCount || 0);
        setCommentsCount(product.commentsCount || 0);
    }, [product]);

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!session) {
            alert("Please sign in to like products");
            return;
        }

        // Optimistic update
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikesCount((prev: number) => newIsLiked ? prev + 1 : prev - 1);

        try {
            const res = await fetch(`/api/products/${product._id}/like`, {
                method: "POST",
            });

            if (res.ok) {
                const data = await res.json();
                setIsLiked(data.isLiked);
                setLikesCount(data.likesCount);
            } else {
                // Revert on failure
                setIsLiked(!newIsLiked);
                setLikesCount((prev: number) => !newIsLiked ? prev + 1 : prev - 1);
            }
        } catch (error) {
            console.error("Error liking product:", error);
            setIsLiked(!newIsLiked);
            setLikesCount((prev: number) => !newIsLiked ? prev + 1 : prev - 1);
        }
    };

    return (
        <article
            className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white animate-scale-in"
            onClick={() => onProductClick(product)}
        >
            <div className="relative h-64 w-full overflow-hidden">
                <Image
                    alt={product.title}
                    src={product.images && product.images.length > 0 ? product.images[0] : '/fallback-image.jpg'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* View button overlay */}
                <button
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2.5 bg-white text-gray-900 font-semibold rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gradient-primary hover:text-white"
                >
                    View Details
                </button>
            </div>

            <div className="p-5">
                <div className="mb-2">
                    <h2 className="text-lg font-display font-semibold text-gray-900 line-clamp-1 group-hover:text-purple-600 transition-colors">
                        {product.title}
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">{product.brand}</p>
                </div>

                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleLike}
                            className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors"
                        >
                            {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                            <span className="text-sm">{likesCount}</span>
                        </button>
                        <div className="flex items-center gap-1 text-gray-500">
                            <FaComment />
                            <span className="text-sm">{commentsCount}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                    <div onClick={(e) => e.stopPropagation()}>
                        <p className="text-xs text-gray-500">Designer</p>
                        <Link
                            href={`/profile/${product.ownerCode || product.ownerUsername || product.ownerName}`}
                            className="text-sm font-medium text-gray-700 hover:underline"
                        >
                            {product.ownerName}
                        </Link>
                    </div>
                    <p className="text-xl font-display font-bold bg-gradient-accent bg-clip-text text-transparent">
                        ${(product.priceInCents / 100).toFixed(2)}
                    </p>
                </div>

                {children && (
                    <div className="mt-4 pt-3 border-t flex justify-end" onClick={(e) => e.stopPropagation()}>
                        {children}
                    </div>
                )}
            </div>
        </article>
    );
}
