"use client"
import { About, Cover, Navbar, UserProductsList, ProductForm } from "@/components";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { CiSettings } from "react-icons/ci";
import { MdAddBusiness } from "react-icons/md";
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
      
      <div className="p-4">
        <div>
          <Cover/>
        </div>
        <div>
          <Link href={settingUrl} className="flex justify-end"><CiSettings size={20}/></Link>
          <About/> 
        </div>
        <div className="p-6">
          <div className="flex justify-end">
            {/* Button to open the modal */}
            <button 
              onClick={toggleModal} 
              className="p-3 bg-white text-green-700 rounded-full hover:bg-green-700 hover:text-white transition"
            >
              <MdAddBusiness size={25} />
            </button>
          </div>
          

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
          <UserProductsList/>
        </div>
      </div>
          </>
  );
}
