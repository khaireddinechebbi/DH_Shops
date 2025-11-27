"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CommentDocument, ImageDocument } from '@/types/types';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import { FaHeart, FaRegHeart, FaPaperPlane, FaTrash } from 'react-icons/fa';

// Define Product type
interface Product {
  _id: string;
  title: string;
  sizes: string[];
  category: string;
  brand: string;
  sex: string;
  priceInCents: number;
  description: string;
  ownerName: string;
  ownerUsername?: string;
  images: ImageDocument[];
  likes: string[];
  comments: CommentDocument[];
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const { addToCart } = useCart();
  const { data: session } = useSession();

  const [comments, setComments] = useState<CommentDocument[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    if (product) {
      setComments(product.comments || []);
      setLikesCount(product.likes?.length || 0);
      // Fetch fresh comments to get populated users
      fetchComments();
      // Check like status (optimistic or separate fetch if needed)
      // For now, default to false unless we persist it in parent or fetch it
    }
  }, [product]);

  const fetchComments = async () => {
    if (!product) return;
    try {
      const res = await fetch(`/api/products/${product._id}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []); // Extract comments array from response
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleNext = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handlePrevious = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
      );
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }

    if (!product) {
      alert("Product not found.");
      return;
    }

    addToCart({
      productId: product._id,
      title: product.title,
      priceInCents: product.priceInCents,
      quantity,
      size: selectedSize,
    });

    alert("Product added to cart!");
    onClose();
  };

  const handleLike = async () => {
    if (!session) {
      alert("Please sign in to like products");
      return;
    }
    if (!product) return;

    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);

    try {
      const res = await fetch(`/api/products/${product._id}/like`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);
      } else {
        setIsLiked(!newIsLiked);
        setLikesCount(prev => !newIsLiked ? prev + 1 : prev - 1);
      }
    } catch (error) {
      console.error("Error liking product:", error);
      setIsLiked(!newIsLiked);
      setLikesCount(prev => !newIsLiked ? prev + 1 : prev - 1);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert("Please sign in to comment");
      return;
    }
    if (!product || !newComment.trim()) return;

    try {
      const res = await fetch(`/api/products/${product._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newComment }),
      });

      if (res.ok) {
        const addedComment = await res.json(); // API now returns comment directly
        setComments([...comments, addedComment]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!product || !confirm("Delete this comment?")) return;

    try {
      const res = await fetch(`/api/products/${product._id}/comments/${commentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setComments(comments.filter(c => c._id !== commentId));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-scale-in flex flex-col md:flex-row">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Left side: Images */}
        <div className="w-full md:w-1/2 bg-gray-100 p-6 flex flex-col justify-center">
          <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-inner">
            <Image
              alt={product.title}
              src={product.images && product.images.length > 0 ? product.images[currentImageIndex] : '/fallback-image.jpg'}
              fill
              className="object-cover"
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/90 text-gray-900 p-2 rounded-full hover:bg-white transition shadow-lg"
                >
                  ←
                </button>
                <button
                  onClick={handleNext}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/90 text-gray-900 p-2 rounded-full hover:bg-white transition shadow-lg"
                >
                  →
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right side: Details & Comments */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col h-full overflow-y-auto">
          {/* Product Header */}
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-display font-bold text-gray-900">{product.title}</h2>
                <Link href={`/profile/${product.ownerCode || product.ownerUsername || product.ownerName}`} className="text-lg text-purple-600 font-medium hover:underline">
                  @{product.ownerName}
                </Link>
              </div>
              <button onClick={handleLike} className="flex flex-col items-center text-gray-500 hover:text-red-500 transition">
                {isLiked ? <FaHeart className="text-red-500 text-2xl" /> : <FaRegHeart className="text-2xl" />}
                <span className="text-xs font-bold">{likesCount}</span>
              </button>
            </div>
            <p className="text-2xl font-display font-bold bg-gradient-accent bg-clip-text text-transparent mt-2">
              ${(product.priceInCents / 100).toFixed(2)}
            </p>
          </div>

          {/* Description & Attributes */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="px-3 py-1 bg-gray-100 rounded-full"><strong>Brand:</strong> {product.brand}</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full"><strong>Category:</strong> {product.category}</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full"><strong>For:</strong> {product.sex}</span>
            </div>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Actions: Size, Qty, Add to Cart */}
          <div className="space-y-4 border-b pb-8 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Size</label>
                <select
                  value={selectedSize || ''}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select</option>
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Qty</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  min={1}
                />
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-lg transition transform hover:scale-[1.02]"
            >
              Add to Cart
            </button>
          </div>

          {/* Comments Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Comments ({comments.length})</h3>

            {/* Comment List */}
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
              {comments.length === 0 && <p className="text-gray-500 italic">No comments yet.</p>}
              {comments.map((comment) => (
                <div key={comment._id} className="bg-gray-50 p-3 rounded-xl">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden relative">
                        {comment.user?.image?.[0] ? (
                          <Image src={comment.user.image[0]} alt="User" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-accent" />
                        )}
                      </div>
                      <span className="font-semibold text-sm">{comment.user?.name || 'User'}</span>
                      <span className="text-xs text-gray-400">{new Date(comment.date).toLocaleDateString()}</span>
                    </div>
                    {session?.user?.email === comment.user?.email && ( // Basic check, ideally check ID
                      <button onClick={() => handleDeleteComment(comment._id)} className="text-red-400 hover:text-red-600">
                        <FaTrash size={12} />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm">{comment.text}</p>
                </div>
              ))}
            </div>

            {/* Add Comment Form */}
            {session ? (
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  <FaPaperPlane />
                </button>
              </form>
            ) : (
              <p className="text-sm text-gray-500 text-center">Sign in to comment</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

