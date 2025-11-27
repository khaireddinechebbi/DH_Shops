"use client";
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { IoClose } from 'react-icons/io5';

export const CartSidebar: React.FC = () => {
  const { cartItems, removeFromCart, clearCart, isCartOpen, toggleCart } = useCart();
  const [orderAddress, setOrderAddress] = useState("");

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.priceInCents * item.quantity);
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

  // Handle order submission
  const handleSubmitOrder = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!orderAddress) {
      alert("Please enter your shipping address.");
      return;
    }

    // Prepare items with the expected format
    const formattedItems = cartItems.map((item) => ({
      productId: item.productId,
      title: item.title,
      size: item.size,
      quantity: item.quantity,
      price: item.priceInCents,
    }));

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: formattedItems,
          address: orderAddress,
          totalPrice: totalPrice / 100,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit order");
      }

      alert("Order submitted successfully!");
      clearCart();
      setOrderAddress("");
      toggleCart(); // Close cart after successful order
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("An error occurred while submitting the order.");
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity animate-fade-in"
          onClick={toggleCart}
        />
      )}

      {/* Cart Sidebar */}
      <div
        className={`fixed right-0 top-0 w-full sm:w-96 h-full bg-white shadow-2xl p-6 overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h2 className="text-2xl font-display font-semibold text-gray-900">Your Cart</h2>
          <button
            onClick={toggleCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <IoClose size={28} className="text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-400 text-lg">Your cart is empty</p>
            <p className="text-gray-400 text-sm mt-2">Add some items to get started!</p>
          </div>
        ) : (
          <div className="mb-6 space-y-4">
            {cartItems.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 flex-1">{item.title}</h3>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-500 hover:text-red-700 ml-2 text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div>
                    <p>Size: <span className="font-medium">{item.size}</span></p>
                    <p>Qty: <span className="font-medium">{item.quantity}</span></p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    ${(item.priceInCents * item.quantity) / 100}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total Price */}
        <div className="mb-6 py-4 border-t border-b">
          <div className="flex justify-between items-center">
            <span className="text-lg font-display font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-display font-bold bg-gradient-accent bg-clip-text text-transparent">
              ${(totalPrice / 100).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mb-6">
          <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
            Shipping Address
          </label>
          <textarea
            id="address"
            value={orderAddress}
            onChange={(e) => setOrderAddress(e.target.value)}
            placeholder="Enter your shipping address..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSubmitOrder}
            disabled={cartItems.length === 0 || !orderAddress}
            className="w-full py-3 bg-gradient-primary text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Place Order
          </button>

          <button
            onClick={clearCart}
            disabled={cartItems.length === 0}
            className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </>
  );
};
