"use client";
import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';

export const CartSidebar: React.FC = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
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

    try {
      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: cartItems, address: orderAddress, totalPrice: totalPrice }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit order");
      }

      alert("Order submitted successfully!");
      clearCart();
      setOrderAddress(""); // Clear the address after successful submission
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("An error occurred while submitting the order.");
    }
  };

  return (
    <div className="fixed right-0 top-0 w-80 h-full bg-white shadow-lg p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Your Cart</h2>

      {/* Cart Items */}
      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="mb-4">
          {cartItems.map((item) => (
            <div key={item.productId} className="mb-4">
              <p className="font-semibold">{item.title}</p>
              <p>Size: {item.size}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: ${(item.priceInCents * item.quantity) / 100}</p>
              <button
                onClick={() => removeFromCart(item.productId)}
                className="text-red-500 hover:text-red-700 mt-2"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Total Price */}
      <div className="mt-4 mb-4">
        <p className="font-semibold">Total Price: ${(totalPrice / 100).toFixed(2)}</p>
      </div>

      {/* Shipping Address */}
      <div className="mb-4">
        <label htmlFor="address" className="block text-sm font-semibold mb-2">Shipping Address</label>
        <textarea
          id="address"
          value={orderAddress}
          onChange={(e) => setOrderAddress(e.target.value)}
          placeholder="Enter your shipping address"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmitOrder}
        disabled={cartItems.length === 0 || !orderAddress}
        className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md disabled:bg-gray-300"
      >
        Submit Order
      </button>

      {/* Clear Cart Button */}
      <button
        onClick={clearCart}
        className="w-full mt-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
      >
        Clear Cart
      </button>
    </div>
  );
};
