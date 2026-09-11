"use client";

import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const Sidebar = () => {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Close the More sheet on navigation or Escape key
  useEffect(() => {
    setIsMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMoreOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
    {
      name: "Competitions",
      href: "/admin/competitions",
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
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
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

      {/* Mobile & Tablet Bottom Navigation Bar (4 Core Tabs + "More" Sheet) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-40 px-2 py-1.5 flex justify-around items-center shadow-lg">
        {/* Primary 4 Tabs */}
        {navItems.slice(0, 4).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[62px] transition-all ${
                isActive
                  ? "bg-blue-100 text-blue-600 px-3 py-1 rounded-2xl"
                  : "text-gray-500 hover:text-gray-900 py-1"
              }`}
            >
              {item.svgIcon(isActive)}
              <span
                className={`text-[10px] sm:text-[11px] mt-0.5 whitespace-nowrap ${
                  isActive
                    ? "font-semibold text-blue-600"
                    : "font-medium text-gray-500"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}

        {/* 5th Tab: "More" Menu Button */}
        {(() => {
          const isSecondaryActive = navItems.slice(4).some((item) => pathname === item.href);
          return (
            <button
              type="button"
              onClick={() => setIsMoreOpen((prev) => !prev)}
              className={`flex flex-col items-center justify-center min-w-[62px] transition-all cursor-pointer relative ${
                isSecondaryActive || isMoreOpen
                  ? "bg-blue-100 text-blue-600 px-3 py-1 rounded-2xl"
                  : "text-gray-500 hover:text-gray-900 py-1"
              }`}
              aria-label="More administration tools"
            >
              {isSecondaryActive && !isMoreOpen && (
                <span className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
              )}
              <svg
                className={`w-6 h-6 ${
                  isSecondaryActive || isMoreOpen ? "text-blue-600" : "text-gray-500"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={isSecondaryActive || isMoreOpen ? 2.2 : 1.8}
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>
              <span
                className={`text-[10px] sm:text-[11px] mt-0.5 ${
                  isSecondaryActive || isMoreOpen
                    ? "font-semibold text-blue-600"
                    : "font-medium text-gray-500"
                }`}
              >
                More
              </span>
            </button>
          );
        })()}
      </div>

      {/* Mobile Bottom Sheet for "More" Administration Tools */}
      {isMoreOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setIsMoreOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Slide-Up Sheet Container */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-5 border-t border-gray-100 animate-in slide-in-from-bottom duration-300 pb-8">
            {/* Grab / Drag Bar */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900 tracking-tight">
                  Admin Tools & Settings
                </h3>
                <p className="text-xs text-gray-500">
                  Manage finances, referrals & cohorts
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMoreOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Grid of Secondary Tools */}
            <div className="space-y-2.5">
              {[
                {
                  name: "Referrals",
                  href: "/admin/referrals",
                  description: "Referral codes, analytics & rewards",
                  iconBg: "bg-purple-50 text-purple-600",
                  svg: navItems[4].svgIcon,
                },
                {
                  name: "Withdrawals",
                  href: "/admin/withdrawals",
                  description: "Vendor payout requests & history",
                  iconBg: "bg-emerald-50 text-emerald-600",
                  svg: navItems[5].svgIcon,
                },
                {
                  name: "Competitions",
                  href: "/admin/competitions",
                  description: "Quarterly top salon leaderboards",
                  iconBg: "bg-amber-50 text-amber-600",
                  svg: navItems[6].svgIcon,
                },
              ].map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMoreOpen(false)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      isActive
                        ? "bg-blue-50/90 border-blue-200 shadow-xs"
                        : "bg-gray-50/70 hover:bg-gray-100 border-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                        {item.svg(isActive)}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${isActive ? "text-blue-700" : "text-gray-900"}`}>
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <svg
                      className={`w-5 h-5 shrink-0 ${isActive ? "text-blue-600" : "text-gray-400"}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
