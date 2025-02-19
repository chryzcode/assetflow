"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdownButton = document.getElementById("dropdown-button");
      const dropdownMenu = document.getElementById("dropdown-menu");
      const mobileDropdownButton = document.getElementById("mobile-dropdown-button");
      const mobileDropdownMenu = document.getElementById("mobile-dropdown-menu");

      if (
        dropdownOpen &&
        dropdownButton &&
        dropdownMenu &&
        !dropdownButton.contains(event.target as Node) &&
        !dropdownMenu.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }

      if (
        mobileDropdownOpen &&
        mobileDropdownButton &&
        mobileDropdownMenu &&
        !mobileDropdownButton.contains(event.target as Node) &&
        !mobileDropdownMenu.contains(event.target as Node)
      ) {
        setMobileDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen, mobileDropdownOpen]);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    setDropdownOpen(false);
    setMobileDropdownOpen(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <nav className="relative flex justify-between items-center py-6 px-6 border-b border-blue-500">
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
        {isAuthenticated && user && (
          <div className="relative hidden md:block">
            <button
              id="dropdown-button"
              className="flex items-center space-x-2 text-white font-bold"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>{user.id}</span>
              <span className="material-icons">arrow_drop_down</span>
            </button>

            {dropdownOpen && (
              <div
                id="dropdown-menu"
                className="absolute right-0 mt-2 w-48 bg-background shadow-lg py-2 z-50"
              >
                <DropdownMenu handleLogout={handleLogout} />
              </div>
            )}
          </div>
        )}

        {!isAuthenticated && (
          <button
            className="bg-blue-500 px-4 py-2 text-white font-bold"
            onClick={() => router.push("/auth/login")}
          >
            Login
          </button>
        )}
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-background mt-6 bg-opacity-10 py-6 flex flex-col items-center space-y-4 md:hidden z-50">
          <NavLinks onClick={() => setIsOpen(false)} />
          
          {isAuthenticated && user && (
            <div className="relative w-full flex justify-end pr-6">
              <button
                id="mobile-dropdown-button"
                className="flex items-center space-x-2 text-white font-bold"
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
              >
                <span>{user.id}</span>
                <span className="material-icons">arrow_drop_down</span>
              </button>

              {mobileDropdownOpen && (
                <div
                  id="mobile-dropdown-menu"
                  className="absolute right-0 mt-6 w-48 bg-background shadow-lg py-2 z-50"
                >
                  <DropdownMenu handleLogout={handleLogout}  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

// NavLinks Component
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

// Dropdown Menu Component
const DropdownMenu = ({ handleLogout }: { handleLogout: () => void }) => (
  <>
    <button
      className="block w-full text-left px-4 py-2 hover:border-b hover:border-blue-500 hover:cursor-pointer"
      onClick={() => {
        window.location.href = "/profile";
      }}
    >
      Update Profile
    </button>
    <button
      className="block w-full text-left px-4 py-2 hover:border-b hover:border-blue-500 hover:cursor-pointer"
      onClick={() => {
        window.location.href = "/settings";
      }}
    >
      Settings
    </button>
    <button
      className="block w-full text-left px-4 py-2 text-red-500 hover:border-b hover:border-blue-500 hover:text-white hover:cursor-pointer"
      onClick={handleLogout}
    >
      Logout
    </button>
  </>
);

export default Navbar;
