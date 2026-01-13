import SearchBox from "./SearchBox";

import dropdown from "../../assets/dropdown_icon.svg";
import salonably from "../../assets/salonably.png";

import Image from "next/image";
import Link from "next/link";

import { getUser } from "../../server/auth";
import NavUserProfile from "./NavUserProfile";

const Navbar = async () => {
  const user = await getUser();

  return (
    <div className="top-0 relative left-0 w-full bg-header p-1 z-50 border-b border-b-gray-400 mb-2 ">
      <header className="flex flex-row gap-3  justify-between items-center max-w-6xl mx-auto  p-4 ">
        <Link className="text-black font-bold text-xl sm:text-3xl" href="/">
          <Image src={salonably} className="sm:w-20 w-12 rounded-full" alt="" />
        </Link>
        <div className="flex-1 max-w-md mx-4  ">
          <SearchBox />
        </div>
        <div>
          {user ? (
            <NavUserProfile user={user} />
          ) : (
            <Link href="/login" className="cursor-pointer">
              <button className="bg-blue-500 p-1 cursor-pointer   sm:p-2 px-2 sm:px-5 rounded-full items-center hover:bg-blue-700 text-white text-xs  sm:text-lg">
                Sign in
              </button>
            </Link>
          )}
        </div>
      </header>
    </div>
  );
};

export default Navbar;
