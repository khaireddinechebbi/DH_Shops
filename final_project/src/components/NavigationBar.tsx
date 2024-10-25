"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleResize = () => {
    if (window.innerWidth > 768) {
      setIsMenuOpen(false);
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Construct the user profile URL
  const profileUrl = session?.user ? `/profile/${session.user.sub}` : "/profile";
  const ordersUrl = session?.user ? `/orders/${session.user.sub}` : "/orders";
  const contactUrl = session?.user ? `/contact/${session.user.sub}` : "/contact";

  return (
    <nav className="relative p-5 bg-white shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <Link href={"/home"}>
            <Image
              src="/designers-heaven2.png"
              width={50}
              height={10}
              alt="designers heaven logo"
            />
          </Link>
        </div>

        <button
          className="group block md:hidden focus:outline-none bg-transparent hover:bg-blue-600 "
          onClick={toggleMenu}
        >
          <div className="w-6 h-1 bg-blue-600 group-hover:bg-white mb-1"></div>
          <div className="w-6 h-1 bg-blue-600 group-hover:bg-white mb-1"></div>
          <div className="w-6 h-1 bg-blue-600 group-hover:bg-white mb-1"></div>
        </button>

        {!isMenuOpen && !isMobile && (
          <div className={`md:flex items-center space-x-4 ${isMobile && isMenuOpen ? "block" : "hidden"}`}>
            <Link href={profileUrl} className="block px-3 py-2">
              Profile
            </Link>
            <Link href={ordersUrl} className="block px-3 py-2">
              Orders
            </Link>
            <Link href={contactUrl} className="block px-3 py-2">
              Contact Us
            </Link>
          </div>
        )}

        <div className="hidden md:block">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-3 py-2 bg-red-500 text-white rounded"
          >
            Sign Out
          </button>
        </div>
      </div>

      {isMenuOpen && isMobile && (
        <div className="md:hidden flex flex-col mt-4">
          <Link href={profileUrl} className="block px-3 py-3">
            Profile
          </Link>
          <Link href={ordersUrl} className="block px-3 py-3">
            Orders
          </Link>
          <Link href={contactUrl} className="block px-3 py-3">
            Contact Us
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-3 py-3 bg-red-500 text-white rounded"
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
