import React from "react";

import barber from "../../../assets/barber.png";
import Image from "next/image";
import Link from "next/link";

const Banner = () => {
  return (
    <div className="flex  bg-blue-500 rounded-lg px-6 md:px-14  lg:px-3  my-20 md:mx-10 ">
      {/*---left---*/}
      <div className=" flex-1  py-8 sm:py-10 md:py-14 lg:py-20 lg:pl-5">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white">
          <p>Book Salon</p>
          <p className="mt-4">With 100+ Trusted Shops</p>
        </div>

        <Link href="/login">
          <button className="cursor-pointer bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-4 hover:scale-105 transition-all duration-300">
            Create account
          </button>
        </Link>
      </div>
      {/*---right---*/}

      <div className="hidden md:block  md:w-1/2 lg:w-[370px] relative ">
        <Image
          className="w-full absolute bottom-0  right-0  max-w-md"
          src={barber}
          alt="slider"
        />
      </div>
    </div>
  );
};

export default Banner;
