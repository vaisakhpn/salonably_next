"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserProps {
  name: string;
  email: string;
  image?: string;
}

const NavUserProfile = ({ user }: { user: UserProps }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  // Close dropdown when clicking outside
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = async () => {
    try {
      await Promise.allSettled([
        fetch("/api/auth/logout", { method: "POST" }),
        fetch("/api/shop/logout", { method: "POST" }),
      ]);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-1 rounded-full hover:bg-gray-100/80 transition-colors focus:outline-none"
        aria-expanded={isOpen}
      >
        <Image
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-gray-200/80 hover:ring-blue-400 transition-all shadow-xs"
          src={
            user.image ||
            "https://cdn3.iconfinder.com/data/icons/essential-rounded/64/Rounded-31-512.png"
          }
          alt={user.name || "profile"}
          width={36}
          height={36}
        />
        <svg
          className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100/90 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* User info banner */}
          <div className="px-4 py-2.5 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Signed in as
            </p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          <div className="p-1 space-y-0.5">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/70 rounded-xl transition-colors"
            >
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>My Profile</span>
            </Link>

            <Link
              href="/profile/my-bookings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/70 rounded-xl transition-colors"
            >
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>My Bookings</span>
            </Link>

            <Link
              href="/refer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-xs sm:text-sm font-medium text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50/70 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-sm">🎁</span>
                <span>Refer & Earn</span>
              </div>
              <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full">
                ₹100
              </span>
            </Link>
          </div>

          <div className="p-1 border-t border-gray-100">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50/80 rounded-xl transition-colors cursor-pointer"
            >
              <svg
                className="w-4 h-4 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavUserProfile;
