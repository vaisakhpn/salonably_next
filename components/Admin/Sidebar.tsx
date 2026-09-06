"use client";

import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      imgIcon: assets.home_icon,
      svgIcon: (isActive: boolean) => (
        <svg
          className={`w-6 h-6 ${isActive ? "text-blue-600" : "text-gray-500"}`}
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
      name: "Bookings",
      href: "/admin/bookings",
      imgIcon: assets.appointment_icon,
      svgIcon: (isActive: boolean) => (
        <svg
          className={`w-6 h-6 ${isActive ? "text-blue-600" : "text-gray-500"}`}
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
      name: "Add Shop",
      href: "/admin/add-shop",
      imgIcon: assets.add_icon,
      svgIcon: (isActive: boolean) => (
        <svg
          className={`w-6 h-6 ${isActive ? "text-blue-600" : "text-gray-500"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isActive ? 2.2 : 1.8}
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      name: "Shops",
      href: "/admin/shop-list",
      imgIcon: assets.shop_icon,
      svgIcon: (isActive: boolean) => (
        <svg
          className={`w-6 h-6 ${isActive ? "text-blue-600" : "text-gray-500"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isActive ? 2.2 : 1.8}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0H9m4 0h2"
          />
        </svg>
      ),
    },
    {
      name: "Referrals",
      href: "/admin/referrals",
      imgIcon: assets.appointment_icon,
      svgIcon: (isActive: boolean) => (
        <svg
          className={`w-6 h-6 ${isActive ? "text-blue-600" : "text-gray-500"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isActive ? 2.2 : 1.8}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      name: "Withdrawals",
      href: "/admin/withdrawals",
      imgIcon: assets.appointment_icon,
      svgIcon: (isActive: boolean) => (
        <svg
          className={`w-6 h-6 ${isActive ? "text-blue-600" : "text-gray-500"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isActive ? 2.2 : 1.8}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Desktop Left Sidebar */}
      <div className="hidden md:block min-h-screen bg-white border-r">
        <ul className="text-gray-600 pt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 py-3.5 px-6 md:min-w-64 cursor-pointer transition-all ${
                  isActive
                    ? "bg-[#F2F3FF] border-r-4 border-blue-500 font-semibold text-blue-600"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <Image width={22} height={22} src={item.imgIcon} alt={item.name} />
                <p className="text-sm font-medium">{item.name}</p>
              </Link>
            );
          })}
        </ul>
      </div>

      {/* Mobile & Tablet Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-50 px-4 py-2 flex justify-around items-center shadow-lg">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-600 px-3.5 py-1.5 rounded-2xl"
                  : "text-gray-500 hover:text-gray-900 py-1"
              }`}
            >
              {item.svgIcon(isActive)}
              <span
                className={`text-[10px] sm:text-[11px] mt-0.5 ${
                  isActive
                    ? "font-semibold text-blue-600"
                    : "font-normal text-gray-500"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Sidebar;
