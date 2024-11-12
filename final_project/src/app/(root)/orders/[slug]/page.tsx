"use client"
import { Navbar } from "@/components";
import { CartSidebar } from "@/components/CartSidebar";
import OrdersList from "@/components/orders/OrdersList";

export default function Orders() {

  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <Navbar />
      </div>
      <div className="mt-4">
        <CartSidebar />
      </div>
      <div className="mt-4">
        <OrdersList />
      </div>
    </div>
  );
}
