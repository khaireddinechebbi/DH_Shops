"use client"
import { Navbar, ProductForm } from "@/components";
import { useState } from "react";

export default function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-semibold mb-4">Profile Page</h1>

        {/* Button to open the modal */}
        <button 
          onClick={toggleModal} 
          className="p-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
        >
          Add New Product
        </button>

        {/* Modal for ProductForm */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
              {/* Close Button */}
              <button 
                onClick={toggleModal} 
                className="absolute top-2 right-2 font-bold bg-transparent text-red-600 hover:text-white z-10"
              >
                ✕
              </button>
              
              {/* Product Form */}
              <ProductForm />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
