import SearchBox from "./SearchBox";
import lockmytime from "../../assets/LockMyTime.png";
import Image from "next/image";
import Link from "next/link";
import { getUser, getShop } from "@/server/middleware/auth";
import NavUserProfile from "./NavUserProfile";


const Navbar = async () => {
  const user = await getUser();
  const shop = await getShop();

  return (
    <div className="sticky top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100 shadow-xs transition-all">
      <header className="flex flex-row gap-3 sm:gap-6 justify-between items-center max-w-7xl mx-auto px-4 py-3 sm:px-6">
        {/* Brand Logo & Name */}
        <Link
          className="flex items-center gap-2 cursor-pointer shrink-0"
          href="/"
        >
          <Image
            src={lockmytime}
            className="w-9 sm:w-11 h-9 sm:h-11 rounded-full object-cover"
            alt="LockMyTime Logo"
          />
          <span className="font-bold hidden md:inline-block text-lg sm:text-2xl text-black tracking-tight">
            Lock<span className="text-blue-600">My</span>Time
          </span>
        </Link>

        {/* Search Bar Container */}
        <div className="flex-1 max-w-lg mx-2 sm:mx-4 hidden sm:block">
          <SearchBox />
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          {shop ? (
            /* Shop Owner is logged in: Show Partner Panel */
            <Link
              href="/shop-owner"
              className="group inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 hover:text-blue-900 border border-blue-200/80 hover:border-blue-300 transition-all duration-200 active:scale-95 shrink-0"
            >
              <svg
                className="w-3.5 h-3.5 text-blue-600 group-hover:text-blue-800 transition-colors shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span>Partner Panel</span>
            </Link>
          ) : user ? (
            /* Logged in Customer (not shop owner): Show Refer Panel */
            <Link
              href="/refer"
              className="group inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100/80 hover:text-indigo-900 border border-indigo-200/80 hover:border-indigo-300 transition-all duration-200 active:scale-95 shrink-0"
            >
              <span>Refer Panel</span>
            </Link>
          ) : (
            /* Without Login (Guest): Show Partner With Us */
            <Link
              href="/shop-owner"
              className="group inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium text-gray-700 bg-gray-50/80 hover:bg-blue-50/80 hover:text-blue-600 border border-gray-200/80 hover:border-blue-200 transition-all duration-200 active:scale-95 shrink-0"
            >
              <svg
                className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-600 transition-colors shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span>Partner With Us</span>
            </Link>
          )}

          {/* User Profile / Sign In */}
          <div className="shrink-0 flex items-center">
            {user ? (
              <NavUserProfile user={user} />
            ) : shop ? (
              <NavUserProfile
                user={{
                  name: shop.name,
                  email: shop.email,
                  image: shop.image,
                }}
              />
            ) : (
              <Link href="/login" className="cursor-pointer">
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-medium px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-xs hover:shadow-md hover:shadow-blue-500/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1">
                  <span>Sign in</span>
                  <svg
                    className="w-3.5 h-3.5 hidden sm:inline-block"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </button>
              </Link>
            )}
          </div>
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
