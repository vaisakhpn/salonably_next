"use client";

import { assets } from "@/assets/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface NavbarProps {
  shopName?: string;
}

const Navbar = ({ shopName }: NavbarProps) => {
  const router = useRouter();

  const logoutHandler = async () => {
    try {
      const response = await fetch("/api/shop/logout", {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        router.push("/shop-owner"); // Will redirect to login view
        router.refresh();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-8 py-3 border-b bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="flex items-center gap-2.5">
        <Image
          src={assets.salonably}
          className="w-10 sm:w-14 cursor-pointer"
          alt="logo"
          onClick={() => router.push("/shop-owner")}
        />
        <div className="flex items-center gap-2">
          <span className="font-bold text-base sm:text-lg text-gray-800 tracking-tight">
            LockMyTime
          </span>
          {shopName && (
            <p className="hidden xs:inline-block border px-2.5 py-0.5 rounded-full border-blue-200 bg-blue-50/80 text-blue-700 text-xs font-medium max-w-[120px] sm:max-w-xs truncate">
              {shopName}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={logoutHandler}
        className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs sm:text-sm font-medium px-4 sm:px-6 py-2 rounded-full cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Navbar;
