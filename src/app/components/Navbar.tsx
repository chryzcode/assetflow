"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { state, dispatch } = useAuth();
  const { isAuthenticated, user } = state;
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false); // Close mobile menu
      }

      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false); // Close desktop dropdown
      }

      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        setMobileDropdownOpen(false); // Close mobile dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    setDropdownOpen(false);
    setMobileDropdownOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <nav ref={navRef} className="relative flex justify-between items-center py-6 px-6 border-b border-blue-500">
      <div className="flex items-center space-x-2">
        <Link href="/">
          <p className="text-xl font-bold text-blue-500">ASSETFLOW</p>
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex flex-1 justify-center space-x-6">
        <NavLinks onClick={() => setIsOpen(false)} />
      </div>

      <div className="flex items-center space-x-4 ml-auto">
        {isAuthenticated && user ? (
          <div ref={dropdownRef} className="relative hidden md:block">
            <button
              className="flex items-center space-x-2 text-white font-bold"
              onClick={() => setDropdownOpen(!dropdownOpen)}>
              <span>{user.id}</span>
              <span className="material-icons">arrow_drop_down</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-background shadow-lg py-2 z-50">
                <DropdownMenu handleLogout={handleLogout} />
              </div>
            )}
          </div>
        ) : (
          <button
            className="hidden md:block bg-blue-500 px-4 py-2 text-white font-bold"
            onClick={() => {
              setIsOpen(false);
              router.push("/auth/register");
            }}>
            Register
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-white ml-auto pt-2" onClick={() => setIsOpen(!isOpen)}>
        <span className="material-icons text-white text-3xl">{isOpen ? "close" : "menu"}</span>
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-background mt-6 bg-opacity-10 py-6 flex flex-col items-center space-y-4 md:hidden z-50">
          <NavLinks onClick={() => setIsOpen(false)} />

          {isAuthenticated && user ? (
            <div ref={mobileDropdownRef} className="relative w-full flex justify-end pr-6">
              <button
                className="flex items-center space-x-2 text-white font-bold"
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}>
                <span>{user.id}</span>
                <span className="material-icons">arrow_drop_down</span>
              </button>

              {mobileDropdownOpen && (
                <div className="absolute right-0 mt-6 w-48 bg-background shadow-lg py-2 z-50">
                  <DropdownMenu handleLogout={handleLogout} />
                </div>
              )}
            </div>
          ) : (
            <button
              className="block bg-blue-500 px-4 py-2 w-full text-white font-bold"
              onClick={() => {
                setIsOpen(false);
                router.push("/auth/register");
              }}>
              Register
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

// NavLinks Component
const NavLinks = ({ onClick }: { onClick: () => void }) => (
  <>
    {[
      { name: "Dashboard", route: "/dashboard" },
      { name: "Asset Marketplace", route: "/assets" },
      { name: "List Asset", route: "/assets/list-asset" },
    ].map(item => (
      <a key={item.name} href={item.route} className="text-white" onClick={onClick}>
        {item.name}
      </a>
    ))}
  </>
);

// Dropdown Menu Component
const DropdownMenu = ({ handleLogout }: { handleLogout: () => void }) => (
  <>
    <button
      className="block w-full text-left px-4 py-2 hover:border-b hover:border-blue-500 hover:cursor-pointer"
      onClick={() => {
        window.location.href = "/assets/my-assets";
      }}>
      My Assets
    </button>

    <button
      className="block w-full text-left px-4 py-2 hover:border-b hover:border-blue-500 hover:cursor-pointer"
      onClick={() => {
        window.location.href = "/auth/settings";
      }}>
      Update Profile
    </button>
    <button
      className="block w-full text-left px-4 py-2 text-red-500 hover:border-b hover:border-blue-500 hover:text-white hover:cursor-pointer"
      onClick={handleLogout}>
      Logout
    </button>
  </>
);

export default Navbar;
