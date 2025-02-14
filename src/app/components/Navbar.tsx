"use client";

import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative flex justify-between items-center py-6 px-6 border-b border-gray-800 bg-black">

      {/* Logo on the left */}
      <div className="flex items-center space-x-2">
        <p className="text-xl font-bold text-blue-500">ASSETFLOW</p>
      </div>

      {/* Desktop Menu - Centered NavLinks */}
      <div className="hidden md:flex flex-1 justify-center space-x-6">
        <NavLinks />
      </div>

      {/* Mobile Menu Button - Align to the right */}
      <button
        className="md:hidden text-white ml-auto pt-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <span className="material-icons text-white text-3xl">close</span>
        ) : (
          <span className="material-icons text-white text-3xl">menu</span>
        )}
      </button>

      {/* Register Button (hidden on mobile) */}
      <div className="hidden md:block ml-auto">
        <button className="bg-blue-500 px-4 py-2 text-white font-bold">
          Register
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-black bg-opacity-90 py-6 flex flex-col items-center space-y-4 md:hidden z-50">
          <NavLinks />
        </div>
      )}
    </nav>
  );
};

// Separate component for menu links to avoid repetition
const NavLinks = () => (
  <>
    {["Home", "Service", "Work", "About us", "Blog"].map((item) => (
      <a
        key={item}
        href="#"
        className="text-white hover:border-b-2 border-blue-900"
      >
        {item}
      </a>
    ))}
  </>
);

export default Navbar;
