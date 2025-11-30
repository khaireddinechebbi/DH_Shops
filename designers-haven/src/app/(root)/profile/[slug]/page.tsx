"use client"
import { About, Navbar, UserProductsList, ProductForm, Footer } from "@/components";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { CiSettings } from "react-icons/ci";
import { MdAddBusiness } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
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
  followers?: string[];
  following?: string[];
  products?: ProductDocument[];
}

export default function Profile({ params }: { params: { slug: string } }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductDocument | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [profileUser, setProfileUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const { data: session } = useSession();

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
          {/* Settings and Sign Out buttons */}
          {isOwner && (
            <div className="flex justify-end gap-3 mb-6">
              <Link href={`/dashboard/${session?.user?.userCode || session?.user?.username}`}>
                <button className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl hover:shadow-green-500/50 transition-all transform hover:scale-110">
                  <MdDashboard size={24} />
                </button>
              </Link>
              <Link href={settingUrl}>
                <button className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all transform hover:scale-110">
                  <CiSettings size={24} />
                </button>
              </Link>
              <button
                onClick={() => setShowSignOutModal(true)}
                className="p-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl hover:shadow-red-500/50 transition-all transform hover:scale-110"
              >
                <FiLogOut size={24} />
              </button>
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
                  className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all transform hover:scale-110"
                  aria-label="Add Product"
                >
                  <MdAddBusiness size={24} />
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

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setShowSignOutModal(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <FiLogOut className="text-white text-3xl" />
              </div>
              <h2 className="text-2xl font-display font-bold text-white">Sign Out</h2>
            </div>

            {/* Modal Content */}
            <div className="p-6 text-center">
              <p className="text-gray-700 text-lg mb-6">
                Are you sure you want to sign out?
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSignOutModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await signOut({ redirect: false });
                    window.location.href = "/";
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
