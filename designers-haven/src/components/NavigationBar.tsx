"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { FiShoppingCart } from "react-icons/fi";

export default function Navbar() {
  const { data: session } = useSession();
  const { cartItems, toggleCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Construct the user profile URL
  // Construct the user profile URL using userCode
  const profileLink = session?.user?.userCode || session?.user?.username;
  const profileUrl = profileLink ? `/profile/${profileLink}` : "/profile";
  const ordersUrl = profileLink ? `/orders/${profileLink}` : "/orders";
  const contactUrl = profileLink ? `/contact/${profileLink}` : "/contact";

  // Calculate total cart items
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${scrolled ? 'glass-dark shadow-lg' : 'bg-white/80 backdrop-blur-md'
      }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href={"/home"} className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 transition-transform group-hover:scale-110">
              <Image
                src="/designers-heaven2.png"
                fill
                alt="designers heaven logo"
                className="object-contain"
              />
            </div>
            <span className={`font-display text-xl font-semibold ${scrolled ? 'text-white' : 'text-gray-900'}`}>
              Designer&apos;s Haven
            </span>
          </Link>

          <button
            className={`group block md:hidden focus:outline-none p-2 rounded-lg transition ${scrolled ? 'hover:bg-white/10' : 'hover:bg-gray-100'
              }`}
            onClick={toggleMenu}
          >
            <div className={`w-6 h-0.5 mb-1.5 transition ${scrolled ? 'bg-white' : 'bg-gray-900'}`}></div>
            <div className={`w-6 h-0.5 mb-1.5 transition ${scrolled ? 'bg-white' : 'bg-gray-900'}`}></div>
            <div className={`w-6 h-0.5 transition ${scrolled ? 'bg-white' : 'bg-gray-900'}`}></div>
          </button>

          {!isMenuOpen && !isMobile && (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href={profileUrl}
                className={`font-medium transition hover:text-purple-600 ${scrolled ? 'text-white' : 'text-gray-700'}`}
              >
                Profile
              </Link>
              <Link
                href={ordersUrl}
                className={`font-medium transition hover:text-purple-600 ${scrolled ? 'text-white' : 'text-gray-700'}`}
              >
                Orders
              </Link>
              <Link
                href={contactUrl}
                className={`font-medium transition hover:text-purple-600 ${scrolled ? 'text-white' : 'text-gray-700'}`}
              >
                Contact
              </Link>
            </div>
          )}

          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className={`relative p-2.5 rounded-full transition ${scrolled ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                }`}
              aria-label="Toggle cart"
            >
              <FiShoppingCart size={22} className={scrolled ? 'text-white' : 'text-gray-900'} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                  {cartItemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-5 py-2.5 bg-gradient-accent text-white rounded-full font-medium hover:shadow-lg transition transform hover:scale-105"
            >
              Sign Out
            </button>
          </div>
        </div>

        {isMenuOpen && isMobile && (
          <div className="md:hidden mt-6 pb-4 space-y-2 animate-fade-in">
            <Link
              href={profileUrl}
              className={`block px-4 py-3 rounded-lg transition ${scrolled ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              Profile
            </Link>
            <Link
              href={ordersUrl}
              className={`block px-4 py-3 rounded-lg transition ${scrolled ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              Orders
            </Link>
            <Link
              href={contactUrl}
              className={`block px-4 py-3 rounded-lg transition ${scrolled ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              Contact
            </Link>

            {/* Cart Button for Mobile */}
            <button
              onClick={() => {
                toggleCart();
                setIsMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${scrolled ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span className="bg-gradient-accent text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full px-4 py-3 bg-gradient-accent text-white rounded-lg font-medium hover:shadow-lg transition"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
