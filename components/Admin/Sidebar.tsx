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
          href={"/admin"}
          className={`flex items-center gap-3 py-3.5 px-3 md:min-w-72 cursor-pointer ${
            pathname === "/admin"
              ? "bg-[#F2F3FF] border-r-4 border-blue-500"
              : ""
          }`}
        >
          <Image width={24} src={assets.home_icon} alt="home" />
          <p className="hidden md:block">Dashboard</p>
        </Link>
        <Link
          href={"/admin/bookings"}
          className={`flex items-center gap-3 py-3.5 px-3 md:min-w-72 cursor-pointer ${
            pathname === "/admin/bookings"
              ? "bg-[#F2F3FF] border-r-4 border-blue-500"
              : ""
          }`}
        >
          <Image width={24} src={assets.appointment_icon} alt="booking" />
          <p className="hidden md:block">Bookings</p>
        </Link>
        <Link
          href={"/admin/add-shop"}
          className={`flex items-center gap-3 py-3.5 px-3 md:min-w-72 cursor-pointer ${
            pathname === "/admin/add-shop"
              ? "bg-[#F2F3FF] border-r-4 border-blue-500"
              : ""
          }`}
        >
          <Image width={24} src={assets.add_icon} alt="Add" />
          <p className="hidden md:block">Add Shop</p>
        </Link>
        <Link
          href={"/admin/shop-list"}
          className={`flex items-center gap-3 py-3.5 px-3 md:min-w-72 cursor-pointer ${
            pathname === "/admin/shop-list"
              ? "bg-[#F2F3FF] border-r-4 border-blue-500"
              : ""
          }`}
        >
          <Image width={24} src={assets.shop_icon} alt="people" />
          <p className="hidden md:block">Shop list</p>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
