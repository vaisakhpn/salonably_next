"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileCustomerBottomNav = () => {
  const pathname = usePathname();

  // Only render on main user routes, not in /admin or /shop-owner
  if (pathname.startsWith("/admin") || pathname.startsWith("/shop-owner")) {
    return null;
  }

  const items = [
    {
      name: "Home",
      href: "/",
      icon: (isActive: boolean) => (
        <svg
          className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-500"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isActive ? 2.2 : 1.8}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: "Explore",
      href: "/shops",
      icon: (isActive: boolean) => (
        <svg
          className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-500"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isActive ? 2.2 : 1.8}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      name: "Bookings",
      href: "/profile/my-bookings",
      icon: (isActive: boolean) => (
        <svg
          className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-500"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isActive ? 2.2 : 1.8}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      name: "Profile",
      href: "/profile",
      icon: (isActive: boolean) => (
        <svg
          className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-500"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isActive ? 2.2 : 1.8}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-50 px-4 py-2 flex justify-around items-center shadow-lg">
      {items.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : item.href === "/profile"
            ? pathname === "/profile"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center transition-all ${
              isActive
                ? "bg-blue-50 text-blue-600 px-4 py-1.5 rounded-2xl font-semibold"
                : "text-gray-500 hover:text-gray-900 py-1"
            }`}
          >
            {item.icon(isActive)}
            <span
              className={`text-[10px] mt-0.5 ${
                isActive ? "font-semibold text-blue-600" : "font-normal text-gray-500"
              }`}
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default MobileCustomerBottomNav;
