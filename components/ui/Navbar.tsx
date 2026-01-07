//import SearchBox from "../SearchBox";

import dropdown from "../../assets/dropdown_icon.svg";
import salonably from "../../assets/salonably.png";

import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="top-0 relative left-0 w-full bg-header p-1 z-50 border-b border-b-gray-400 mb-2 ">
      <header className="flex flex-row gap-3  justify-between items-center max-w-6xl mx-auto  p-4 ">
        <Link className="text-black font-bold text-xl sm:text-3xl" href="/">
          <Image src={salonably} className="sm:w-20 w-12 rounded-full" alt="" />
        </Link>
        {/* <div className="flex items-center  text-sm">
          <SearchBox label="Glam up,Kochi.." />
        </div> */}
        <div>
          {/* <div className="flex items-center gap-2 cursor-pointer group relative">
            <Image
              className="sm:w-14 w-8 rounded-full object-cover sm:h-10 h-8"
              src=""
              alt="profile"
            />
            <Image className="w-2.5" src={dropdown} alt="dropdown" />
            <div className="absolute top-0 right-0 pt-16 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p className="hover:text-black cursor-pointer">My Profile</p>
                <p className="hover:text-black cursor-pointer">My Bookings</p>
                <p className="hover:text-black cursor-pointer">Logout</p>
              </div>
            </div>
          </div> */}

          <button className="bg-blue-500 p-1   sm:p-2 px-2 sm:px-5 rounded-full items-center hover:bg-blue-700 text-white text-xs  sm:text-lg">
            Sign in
          </button>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
