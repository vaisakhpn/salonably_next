"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { assets } from "@/assets/assets";

interface UserProps {
  name: string;
  email: string;
  image?: string;
}

const MobileMenu = ({ user }: { user: UserProps | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
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
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
        router.refresh();
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="relative sm:hidden" ref={dropdownRef}>
      <div className="cursor-pointer p-2" onClick={() => setIsOpen(!isOpen)}>
        <Image src={assets.dropdown_icon} alt="Menu" width={16} height={16} />
      </div>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
          <Link
            href="/shop-owner"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            For Business
          </Link>

          {user ? (
            <>
              <div className="border-t border-gray-100 my-1"></div>
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                My Profile
              </Link>
              <Link
                href="/profile/my-bookings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                My Bookings
              </Link>
              <div
                onClick={handleLogout}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </div>
            </>
          ) : (
            <>
              <div className="border-t border-gray-100 my-1"></div>
              <Link
                href="/login"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
