"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as HTMLElement).closest("nav")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  const router = useRouter();

  return (
    <nav className="relative flex justify-between items-center py-6 px-6 border-b border-blue-500">
      {/* Logo on the left */}
      <div className="flex items-center space-x-2">
        <Link href="/">
          <p className="text-xl font-bold text-blue-500">ASSETFLOW</p>
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex flex-1 justify-center space-x-6">
        <NavLinks onClick={() => setIsOpen(false)} />
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white ml-auto pt-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="material-icons text-white text-3xl">
          {isOpen ? "close" : "menu"}
        </span>
      </button>

      {/* Register Button (hidden on mobile) */}
      <div className="hidden md:block ml-auto">
        <button className="bg-blue-500 px-4 py-2 text-white font-bold" onClick={() => router.push("/auth/register")}>
          Register
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-background mt-6 bg-opacity-10 py-6 flex flex-col items-center space-y-4 md:hidden z-50">
          <NavLinks onClick={() => setIsOpen(false)} />
        </div>
      )}
    </nav>
  );
};

// NavLinks Component (Closes menu on click)
const NavLinks = ({ onClick }: { onClick: () => void }) => (
  <>
    {["Home", "Service", "Work", "About us", "Blog"].map((item) => (
      <a
        key={item}
        href="#"
        className="text-white hover:border-b-2 border-blue-900"
        onClick={onClick}
      >
        {item}
      </a>
    ))}
  </>
);

export default Navbar;
