import { assets } from "@/assets/assets";
import Image from "next/image";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex items-center gap-2 text-xs0">
        <Image
          src={assets.salonably}
          className="w-12 sm:w-16 cursor-pointer"
          alt="logo"
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          "Admin"
        </p>
      </div>
      <button className="bg-blue-500 text-white text-sm px-10 py-2 rounded-full">
        Logout
      </button>
    </div>
  );
};

export default Navbar;
