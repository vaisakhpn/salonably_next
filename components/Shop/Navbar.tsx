"use client";

import { assets } from "@/assets/assets";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Navbar = () => {
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
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex items-center gap-2 text-xs0">
        <Image
          src={assets.salonably}
          className="w-12 sm:w-16 cursor-pointer"
          alt="logo"
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          "Shop Panel"
        </p>
      </div>
      <button
        onClick={logoutHandler}
        className="bg-blue-500 text-white text-sm px-10 py-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
