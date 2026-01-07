import React from "react";
import group from "../../../assets/group_profiles.png";
import book_arrow from "../../../assets/arrow_icon.svg";
import slider_img from "../../../assets/hero.png";
import Image from "next/image";

const Header = () => {
  return (
    <div className="flex flex-col md:flex-row flex-wrap bg-blue-500 rounded-lg px-6 md:px-10 lg:px-20">
      {/*---right/image---*/}
      <div className="md:w-1/2 order-1 md:order-2 mt-4 md:mt-0 relative flex items-center justify-center">
        <Image
          className="w-full md:absolute max-h-96 rounded-lg "
          src={slider_img}
          alt="slider"
        />
      </div>
      {/*---left/text---*/}
      <div className="md:w-1/2 order-2 md:order-1 flex flex-col items-start justify-center gap-2 py-10 m-auto md:py-[10vw] md:mb-[-30px]">
        <p className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight">
          <span className="sm:text-3xl text-xl ">Welcome to</span> Salonably
          <br /> <span className="sm:text-3xl text-xl">Glam Up with us</span>
        </p>
        <div className="flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light">
          <Image
            className="w-28 hidden md:block"
            src={group}
            alt="group_profile"
          />
          <p>
            Discover top-rated salons near you and book your beauty{" "}
            <br className="hidden sm:block " />
            appointment in seconds
          </p>
        </div>
        <div className="mt-3 flex w-full items-center justify-center md:justify-start md:items-start">
          <button className="flex items-center justify-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300">
            Book Now <Image className="w-3" src={book_arrow} alt="book" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
