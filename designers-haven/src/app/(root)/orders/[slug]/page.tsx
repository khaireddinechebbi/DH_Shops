"use client"
import { Footer, Navbar } from "@/components";
import { CartSidebar } from "@/components/CartSidebar";
import OrdersList from "@/components/orders/OrdersList";

export default function Orders() {

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="mt-4">
        <CartSidebar />
        <OrdersList />
      </div>
      <Footer/>
    </div>
  );
}
