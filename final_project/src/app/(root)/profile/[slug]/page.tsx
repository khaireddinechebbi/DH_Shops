"use client"
import { About, Cover, Navbar, Posts, ProductForm } from "@/components";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const { data: session } = useSession();
  const settingUrl = session?.user ? `/profile/${session.user.sub}/setting` : "/setting";
  return (
    <>
      <Navbar />
      
      <div>
        <div>
          <Cover/>
        </div>
        <div>
          <About/>
          <Link href={settingUrl}>Setting</Link>
        </div>
        <div className="p-6">

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
        <div>
          <Posts/>
        </div>
      </div>
          </>
  );
}
