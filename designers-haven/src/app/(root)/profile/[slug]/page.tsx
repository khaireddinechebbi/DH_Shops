"use client"
import { About, Navbar, UserProductsList, ProductForm, Footer } from "@/components";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CiSettings } from "react-icons/ci";
import { MdAddBusiness } from "react-icons/md";
import { ProductDocument } from "@/types/types";

interface UserData {
  _id: string;
  name: string;
  username: string;
  email?: string;
  bio?: string;
  phone?: string;
  image?: string[];
  followersCount?: number;
  followingCount?: number;
  followers?: any[];
  following?: any[];
  products?: ProductDocument[];
}

export default function Profile({ params }: { params: { slug: string } }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductDocument | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [profileUser, setProfileUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();
  const isOwnProfile = session?.user?.email === profileUser?.email || session?.user?.name === profileUser?.username; // Fallback check
  // Better check: if session.user.email matches profileUser.email (if available) or if we can get ID.
  // The API /api/user/[username] doesn't return email for public.
  // But if it's own profile, we might want to know.
  // Actually, let's check if session.user.name (which might be username?) matches params.slug.
  // Or better, fetch /api/user/get (myself) and compare IDs?
  // Let's assume for now we can compare usernames if session has it, or just rely on the fact that if I can edit, it's me.
  // Wait, session.user usually has name, email, image.
  // If I am logged in, I can check if my email matches the fetched user's email (if I fetch it).
  // But public API doesn't return email.
  // I should probably fetch "me" and compare IDs.
  // Or, I can rely on the fact that if I am visiting /profile/myusername, it is me.
  // But I need to know "myusername".
  // Let's assume session.user.name is NOT the username, but the full name.
  // I need to know my own username to compare.
  // For now, let's fetch the profile user. If the fetched user has the same email as session, it's me.
  // But public API hides email.
  // I'll update the API to return email if the requester is the owner? No, API doesn't know requester easily without session check.
  // Let's just compare session.user.email with profileUser.email if it exists.
  // Wait, if I am the owner, I should be able to see my email.
  // The API /api/user/[username] currently DOES NOT return email.
  // So I can't compare email.
  // I will rely on a separate check or just fetch "me" to get my username.


  // Check ownership using userCode if available, otherwise fallback to username/email
  const isOwner =
    (session?.user?.userCode && session.user.userCode === params.slug) ||
    (session?.user?.username === params.slug) ||
    (profileUser?.email && session?.user?.email === profileUser.email);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Fetch by code (which is passed as slug)
        console.log("Fetching user profile for slug:", params.slug);
        const res = await fetch(`/api/user/${params.slug}`);
        if (res.ok) {
          const data = await res.json();
          console.log("User profile data fetched:", data);
          setProfileUser(data);
        } else {
          // Handle user not found
          console.error("User not found for slug:", params.slug);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [params.slug, refreshTrigger]);


  const settingUrl = session?.user?.userCode ? `/profile/${session.user.userCode}/setting` : "/setting";

  const toggleModal = useCallback(() => {
    setIsModalOpen(prev => !prev);
    if (isModalOpen) {
      setProductToEdit(null);
    }
  }, [isModalOpen]);

  const handleEdit = useCallback((product: ProductDocument) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  }, []);

  const handleProductFormClose = useCallback(() => {
    toggleModal();
    setProductToEdit(null);
    setRefreshTrigger(prev => prev + 1);
  }, [toggleModal]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      toggleModal();
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!profileUser) {
    return <div className="min-h-screen flex items-center justify-center">User not found</div>;
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Settings button - Only for owner */}
          {isOwner && (
            <div className="flex justify-end mb-6">
              <Link
                href={settingUrl}
                className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110"
              >
                <CiSettings size={24} className="text-gray-700" />
              </Link>
            </div>
          )}

          {/* User info section */}
          <div className="mb-8">
            <About user={profileUser} isOwnProfile={!!isOwner} />
          </div>

          {/* Products section */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-gray-900">
                {isOwner ? "My Products" : `${profileUser.name}'s Products`}
              </h2>
              {isOwner && (
                <button
                  onClick={() => {
                    setProductToEdit(null);
                    toggleModal();
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-full hover:shadow-lg transition-all transform hover:scale-105"
                >
                  <MdAddBusiness size={20} />
                  <span className="font-semibold">Add Product</span>
                </button>
              )}
            </div>

            <UserProductsList
              onEdit={handleEdit}
              refreshProducts={() => setRefreshTrigger(prev => prev + 1)}
              onProductAddedOrUpdated={handleProductFormClose}
              refreshTrigger={refreshTrigger}
              products={profileUser.products}
              isOwnProfile={!!isOwner}
            />
          </div>
        </div>
      </div>

      {/* Modal for ProductForm */}
      {isModalOpen && isOwner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-scale-in">
            <button
              onClick={toggleModal}
              className="sticky top-4 right-4 ml-auto mr-4 mt-4 w-10 h-10 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-all transform hover:scale-110 shadow-lg z-10"
            >
              ✕
            </button>

            <div className="p-6 pt-0">
              <ProductForm initialData={productToEdit} onProductAddedOrUpdated={handleProductFormClose} />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
