import React from "react";
import Link from "next/link";

const Banner = () => {
  return (
    <div className="my-16 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="relative bg-gradient-to-r from-blue-100/90 via-blue-50/70 to-indigo-50/80 rounded-3xl p-8 sm:p-12 overflow-hidden border border-blue-100/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Content */}
        <div className="space-y-4 max-w-xl text-center md:text-left z-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Ready to book your beauty appointment?
          </h2>
          <p className="text-xs sm:text-base text-gray-600 leading-relaxed">
            Join millions of happy customers and experience the best salons near you.
          </p>
          <div className="pt-2 flex justify-center md:justify-start">
            <Link href="/shops" className="cursor-pointer">
              <button className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer">
                <span>Book Now</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </Link>
          </div>
        </div>

        {/* Right Smartphone Calendar Illustration */}
        <div className="relative flex items-center justify-center min-w-[200px] h-48 sm:h-56">
          <div className="w-40 sm:w-48 h-48 sm:h-56 bg-white rounded-3xl border-4 border-blue-500 shadow-xl p-4 flex flex-col items-center justify-center relative rotate-3 hover:rotate-0 transition-transform">
            {/* Top Notch */}
            <div className="w-16 h-1.5 bg-gray-200 rounded-full mb-3" />

            {/* Calendar Icon Box */}
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-xs mb-2">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            {/* Checkmark Badge */}
            <div className="bg-emerald-500 text-white p-1 rounded-full shadow-xs">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Bell Notification Badge */}
            <div className="absolute -top-2 -right-2 bg-amber-400 border-2 border-white text-white p-2 rounded-full shadow-md animate-bounce">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
