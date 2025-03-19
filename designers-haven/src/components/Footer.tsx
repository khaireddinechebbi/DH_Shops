import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-300 text-black py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h4 className="text-xl font-bold">Designer&apos;s Haven</h4>
          <p className="text-sm mt-1">Empowering independent designers around the world.</p>
        </div>

        <div className="text-sm text-gray-600 text-center md:text-right">
          <p>&copy; {new Date().getFullYear()} Designer&apos;s Haven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
