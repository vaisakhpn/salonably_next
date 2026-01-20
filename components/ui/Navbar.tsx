import SearchBox from "./SearchBox";

import salonably from "../../assets/salonably.png";

import Image from "next/image";
import Link from "next/link";

import { getUser } from "@/server/middleware/auth";
import NavUserProfile from "./NavUserProfile";
import { assets } from "@/assets/assets";
import MobileMenu from "./MobileMenu";

const Navbar = async () => {
  const user = await getUser();

  return (
    <div className="top-0 relative left-0 w-full bg-header p-1 z-50 border-b border-b-gray-400 mb-2 ">
      <header className="flex flex-row gap-3  justify-between items-center max-w-6xl mx-auto  p-4 ">
        <Link className="text-black font-bold text-xl sm:text-3xl" href="/">
          <Image
            src={salonably}
            className="sm:w-16 w-10  rounded-full"
            alt=""
          />
        </Link>
        <div className="flex-1 max-w-md mx-auto">
          <SearchBox />
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/shop-owner"
            className="hidden sm:block text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            For Business
          </Link>

          {/* Desktop User Profile / Sign In */}
          <div className="hidden sm:block">
            {user ? (
              <NavUserProfile user={user} />
            ) : (
              <Link href="/login" className="cursor-pointer">
                <button className="bg-blue-500 p-1 cursor-pointer sm:p-2 px-2 sm:px-5 rounded-full items-center hover:bg-blue-700 text-white text-xs sm:text-lg">
                  Sign in
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <MobileMenu user={user} />
        </div>
      </header>
    </div>
  );
};

export default Navbar;
