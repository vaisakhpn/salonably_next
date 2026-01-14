"use client";

import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white border-r">
      <ul className="text-gray-600">
        <Link
          href={"/shop-owner"}
          className={`flex items-center gap-3 py-3.5 px-3 md:min-w-72 cursor-pointer ${
            pathname === "/shop-owner"
              ? "bg-[#F2F3FF] border-r-4 border-blue-500"
              : ""
          }`}
        >
          <Image width={24} src={assets.home_icon} alt="home" />
          <p className="hidden md:block">Dashboard</p>
        </Link>
        <Link
          href={"/shop-owner/shop-booking"}
          className={`flex items-center gap-3 py-3.5 px-3 md:min-w-72 cursor-pointer ${
            pathname === "/shop-owner/shop-booking"
              ? "bg-[#F2F3FF] border-r-4 border-blue-500"
              : ""
          }`}
        >
          <Image width={24} src={assets.appointment_icon} alt="booking" />
          <p className="hidden md:block">Bookings</p>
        </Link>
        <Link
          href={"/shop-owner/shop-profile"}
          className={`flex items-center gap-3 py-3.5 px-3 md:min-w-72 cursor-pointer ${
            pathname === "/shop-owner/shop-profile"
              ? "bg-[#F2F3FF] border-r-4 border-blue-500"
              : ""
          }`}
        >
          <Image width={24} src={assets.info_icon} alt="people" />
          <p className="hidden md:block">Profile</p>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
