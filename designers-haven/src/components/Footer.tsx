import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative mt-20 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-20 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-pink-500 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative w-12 h-12">
                <Image
                  src="/designers-heaven2.png"
                  fill
                  alt="Designer's Haven logo"
                  className="object-contain"
                />
              </div>
              <span className="font-display text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Designer's Haven
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-md">
              Empowering independent designers around the world to showcase their unique creations and connect with fashion enthusiasts globally.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110">
                <FaFacebook className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110">
                <FaTwitter className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110">
                <FaInstagram className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110">
                <FaLinkedin className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-purple-300">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/home" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  Orders
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-purple-300">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors text-sm">
                  FAQs
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Designer's Haven. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center gap-1">
            Made with <FaHeart className="text-red-500 animate-pulse" /> by passionate designers
          </p>
        </div>
      </div>

      {/* Decorative Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600"></div>
    </footer>
  );
}
