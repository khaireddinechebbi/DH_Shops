"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaShoppingBag, FaCalendar, FaBox, FaTimes, FaReceipt } from "react-icons/fa";

// Define the types for Order and Item
interface Item {
  productId?: string;
  title?: string;
  quantity?: number;
  price?: number;
  size?: string;
  sex?: string;
  imageUrl?: string;
}

interface Order {
  _id?: string;
  items?: Item[];
  totalPrice?: number;
  createdAt?: string;
  address?: string;
}

interface OrdersResponse {
  orders: Order[];
}

// Function to fetch orders
const getOrders = async (): Promise<OrdersResponse | null> => {
  try {
    const res = await fetch("/api/user/orders", {
      cache: "no-cache",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch orders");
    }

    return res.json();
  } catch (err) {
    console.error("Error fetching orders:", err);
    return null;
  }
};

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders();
      if (data) {
        setOrders(data.orders || []);
      } else {
        setError("Failed to fetch orders");
      }
    };

    fetchOrders();
  }, []);

  const handleViewItems = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-32 pb-20 px-6">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-12 animate-slide-down">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <FaShoppingBag className="text-white text-xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
              My Orders
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Track and manage your purchase history</p>
        </div>

        {/* Orders List */}
        <div className="max-w-6xl mx-auto">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <p className="text-red-600 font-semibold">{error}</p>
            </div>
          ) : orders.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 animate-slide-up">
              {orders.map((order, index) => (
                <article
                  key={order._id || index}
                  className="group relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient Border Effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>

                  <div className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      {/* Order Info */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <FaReceipt className="text-purple-600" />
                          </div>
                          <div>
                            <h2 className="font-display font-semibold text-lg text-gray-900">
                              Order #{order._id?.slice(-8).toUpperCase() || "N/A"}
                            </h2>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <FaCalendar className="text-xs" />
                              {formatDate(order.createdAt)}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="bg-purple-50 rounded-xl p-3">
                            <p className="text-xs text-gray-600 mb-1">Items</p>
                            <p className="font-semibold text-purple-600 flex items-center gap-1">
                              <FaBox className="text-sm" />
                              {order.items?.length || 0}
                            </p>
                          </div>
                          <div className="bg-pink-50 rounded-xl p-3">
                            <p className="text-xs text-gray-600 mb-1">Total</p>
                            <p className="font-semibold text-pink-600 text-lg">
                              ${order.totalPrice?.toFixed(2) || "0.00"}
                            </p>
                          </div>
                          <div className="bg-indigo-50 rounded-xl p-3 col-span-2 md:col-span-1">
                            <p className="text-xs text-gray-600 mb-1">Status</p>
                            <p className="font-semibold text-indigo-600">Processing</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleViewItems(order)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                      >
                        View Items
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-lg p-12 text-center animate-slide-up">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <FaShoppingBag className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">No Orders Yet</h3>
              <p className="text-gray-600">Start shopping to see your orders here!</p>
            </div>
          )}
        </div>
      </main>

      {/* Order Items Modal */}
      {selectedOrder && selectedOrder.items && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display font-bold text-white mb-1">Order Details</h2>
                <p className="text-purple-100 text-sm">
                  #{selectedOrder._id?.slice(-8).toUpperCase() || "N/A"}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition"
              >
                <FaTimes className="text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Order Summary */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Order Date</p>
                    <p className="font-semibold text-gray-900">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Items</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.items.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Price</p>
                    <p className="font-semibold text-purple-600 text-lg">
                      ${selectedOrder.totalPrice?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <p className="font-semibold text-green-600">Processing</p>
                  </div>
                </div>
              </div>

              {/* Items Grid */}
              <h3 className="font-display font-semibold text-xl text-gray-900 mb-4">Items in Order</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedOrder.items.map((item, index) => (
                  <div
                    key={index}
                    className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 border-2 border-gray-100 hover:border-purple-200 transition-all duration-300"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.title || "Product"}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                            <FaBox className="text-purple-400 text-2xl" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                          {item.title || "Unnamed item"}
                        </h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Size:</span>
                            <span className="font-medium text-gray-900">{item.size || "N/A"}</span>
                          </div>
                          {item.sex && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Gender:</span>
                              <span className="font-medium text-gray-900 capitalize">{item.sex}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Quantity:</span>
                            <span className="font-medium text-gray-900">×{item.quantity || 1}</span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <span className="text-gray-600">Price:</span>
                            <span className="font-bold text-purple-600">
                              ${item.price ? (item.price / 100).toFixed(2) : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
