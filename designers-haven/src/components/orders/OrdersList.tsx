"use client";
import { useState, useEffect } from "react";

// Define the types for Order and Item
interface Item {
  title?: string;
  quantity?: number;
  price?: number;
  size?: string;
  imageUrl?: string; // Assuming each item has an optional image URL
}

interface Order {
  _id?: string;
  items?: Item[];
  totalPrice?: number;
  createdAt?: string;
}

interface OrdersResponse {
  orders: Order[];
}

// Function to fetch orders
const getOrders = async (): Promise<OrdersResponse | null> => {
  try {
    const res = await fetch("http://localhost:3000/api/user/orders", {
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
      console.log("Fetched data:", data); // Inspect fetched data structure
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

  return (
    <>
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>

        {error ? (
          <p className="text-red-500">{error}</p>
        ) : orders.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {orders.map((order) => (
              <article
                key={order._id || Math.random()}
                className="overflow-hidden rounded-lg shadow transition hover:shadow-lg p-4 border mb-4"
              >
                <h2 className="text-lg font-semibold">Order ID: {order._id || "N/A"}</h2>
                <p className="text-sm text-gray-500">
                  Order Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Unknown"}
                </p>
                <p className="text-sm text-gray-500">
                  Total Items: {order.items ? order.items.length : 0}
                </p>
                <p className="text-lg font-semibold">
                  Total Price: {order.totalPrice ? `$${(order.totalPrice).toFixed(2)}` : "Unavailable"}
                </p>
                <button
                  onClick={() => handleViewItems(order)}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  View Items
                </button>
              </article>
            ))}
          </div>
        ) : (
          <p>No orders found.</p>
        )}
      </main>

      {/* Modal for displaying order items */}
      {selectedOrder && selectedOrder.items ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-w-md">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <ul className="space-y-4">
              {selectedOrder.items.map((item, index) => (
                <li key={index} className="flex items-center space-x-4">
                  <div>
                    <p className="text-sm font-semibold">{item.title || "Unnamed item"}</p>
                    <p className="text-sm">Size: {item.size ?? "N/A"}</p>
                    <p className="text-sm">Quantity: {item.quantity ?? "N/A"}</p>
                    <p className="text-sm">Price: {item.price ? `$${(item.price / 100).toFixed(2)}` : "N/A"}</p>
                  </div>
                </li>
              ))}
            </ul>
            <button
              onClick={handleCloseModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
