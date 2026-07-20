import React from "react";
import group from "../../../assets/group_profiles.png";
import book_arrow from "../../../assets/arrow_icon.svg";
import slider_img from "../../../assets/hero.png";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <div className="relative py-6 sm:py-10">
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Left Text Column */}
        <div className="w-full lg:w-1/2 space-y-5 text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs sm:text-sm font-medium">
            <span>✨</span>
            <span>Your Beauty, Our Priority</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.15] tracking-tight">
            Welcome to <br className="hidden sm:inline" />
            <span className="text-blue-600">LockMyTime</span>
            <br />
            <span className="text-gray-800 text-2xl sm:text-4xl lg:text-5xl font-bold">
              Glam Up with us
            </span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-600 max-w-lg leading-relaxed">
            Discover top-rated salons near you and book your beauty appointment
            in seconds.
          </p>

          {/* Customer Proof Badge */}
          <div className="flex items-center gap-3 pt-1">
            <Image
              className="w-24 sm:w-28 h-auto object-contain"
              src={group}
              alt="Happy customers"
            />
            <div className="text-xs sm:text-sm">
              <p className="font-bold text-gray-900">2K+ Happy Customers</p>
              <p className="text-gray-500 font-normal">Book. Relax. Glam Up.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <Link href="/shops" className="cursor-pointer">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm sm:text-base px-7 sm:px-9 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer">
                <span>Book Now</span>
                <Image
                  className="w-3.5 h-3.5 filter invert"
                  src={book_arrow}
                  alt="arrow"
                />
              </button>
            </Link>

            <Link href="/about" className="cursor-pointer">
              <button className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium text-sm sm:text-base px-6 sm:px-7 py-3.5 rounded-full transition-all cursor-pointer">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>How it works</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Right Hero Image Column */}
        <div className="w-full lg:w-1/2 relative">
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-100 max-h-[380px] sm:max-h-[440px]">
            <Image
              className="w-full h-full object-cover rounded-3xl"
              src={slider_img}
              alt="Salon Interior"
              priority
            />
          </div>

          {/* 4 Feature Overlay Card Box (Matching Mockup) */}
          <div className="mt-4 sm:-mt-10 sm:relative z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-100/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {/* Feature 1 */}
            <div className="flex flex-col items-center p-2 rounded-xl bg-blue-50/50 hover:bg-blue-50 transition-colors">
              <div className="p-2 bg-blue-100/70 text-blue-600 rounded-xl mb-1.5">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <p className="font-bold text-gray-900 text-xs sm:text-sm">
                Near You
              </p>
              <p className="text-[11px] text-gray-500 leading-tight hidden sm:block">
                Find salons nearby
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center p-2 rounded-xl bg-amber-50/50 hover:bg-amber-50 transition-colors">
              <div className="p-2 bg-amber-100/70 text-amber-600 rounded-xl mb-1.5">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <p className="font-bold text-gray-900 text-xs sm:text-sm">
                Top Rated
              </p>
              <p className="text-[11px] text-gray-500 leading-tight hidden sm:block">
                Choose top-rated
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center p-2 rounded-xl bg-indigo-50/50 hover:bg-indigo-50 transition-colors">
              <div className="p-2 bg-indigo-100/70 text-indigo-600 rounded-xl mb-1.5">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="font-bold text-gray-900 text-xs sm:text-sm">
                Easy Booking
              </p>
              <p className="text-[11px] text-gray-500 leading-tight hidden sm:block">
                Book in few clicks
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center p-2 rounded-xl bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
              <div className="p-2 bg-emerald-100/70 text-emerald-600 rounded-xl mb-1.5">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <p className="font-bold text-gray-900 text-xs sm:text-sm">
                Trusted & Safe
              </p>
              <p className="text-[11px] text-gray-500 leading-tight hidden sm:block">
                Verified salons
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
