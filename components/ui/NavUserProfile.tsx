"use client";

import React from "react";
import Image from "next/image";
import dropdown from "../../assets/dropdown_icon.svg";
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
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login"); // or /
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image
          className="sm:w-14 w-8 rounded-full object-cover sm:h-10 h-8"
          src={
            user.image ||
            "https://cdn3.iconfinder.com/data/icons/essential-rounded/64/Rounded-31-512.png"
          }
          alt="profile"
          width={56}
          height={40}
        />
        <Image className="w-2.5" src={dropdown} alt="dropdown" />
      </div>

      {isOpen && (
        <div className="absolute top-0 right-0 pt-16 text-base font-medium text-gray-600 z-20">
          <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4 shadow-lg">
            <Link href="/profile">
              <p className="hover:text-black cursor-pointer">My Profile</p>
            </Link>
            <Link href="/profile/my-bookings">
              <p className="hover:text-black cursor-pointer">My Bookings</p>
            </Link>

            <div
              onClick={handleLogout}
              className="hover:text-black cursor-pointer"
            >
              Logout
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavUserProfile;
