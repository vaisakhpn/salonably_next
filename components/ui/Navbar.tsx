import SearchBox from "./SearchBox";
import lockmytime from "../../assets/LockMyTime.png";
import Image from "next/image";
import Link from "next/link";
import { getUser } from "@/server/middleware/auth";
import NavUserProfile from "./NavUserProfile";
import MobileMenu from "./MobileMenu";

const Navbar = async () => {
  const user = await getUser();

  return (
    <div className="sticky top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100 shadow-xs transition-all">
      <header className="flex flex-row gap-3 sm:gap-6 justify-between items-center max-w-7xl mx-auto px-4 py-3 sm:px-6">
        {/* Brand Logo & Name */}
        <Link className="flex items-center gap-2 cursor-pointer shrink-0" href="/">
          <Image
            src={lockmytime}
            className="w-9 sm:w-11 h-9 sm:h-11 rounded-full object-cover"
            alt="LockMyTime Logo"
          />
          <span className="font-bold text-lg sm:text-2xl text-blue-600 tracking-tight">
            LockMyTime
          </span>
        </Link>

        {/* Search Bar Container */}
        <div className="flex-1 max-w-lg mx-2 sm:mx-4 hidden sm:block">
          <SearchBox />
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/shop-owner"
            className="hidden md:inline-block text-xs sm:text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
          >
            For Business
          </Link>

          {/* Desktop User Profile / Sign In */}
          <div className="hidden sm:block">
            {user ? (
              <NavUserProfile user={user} />
            ) : (
              <Link href="/login" className="cursor-pointer">
                <button className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs sm:text-sm font-semibold px-5 sm:px-6 py-2 rounded-full cursor-pointer transition-all shadow-xs">
                  Sign in
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <MobileMenu user={user} />
        </div>
      </header>

      {/* Mobile Search Bar Row */}
      <div className="px-4 pb-3 block sm:hidden">
        <SearchBox />
      </div>
    </div>
  );
};

export default Navbar;
