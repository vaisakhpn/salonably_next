"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import group from "@/assets/group_profiles.png";
import slider_img from "@/assets/hero.png";
import book_arrow from "@/assets/arrow_icon.svg";
import { ShopData } from "../ShopCard";
import StatsBanner from "./StatsBanner";
import ComingSoonArea from "../ComingSoonArea";

interface MobileHomePageProps {
  shops: ShopData[];
}

const MobileHomePage: React.FC<MobileHomePageProps> = ({ shops }) => {
  const categories = [
    {
      name: "Haircut",
      price: "₹199",
      icon: (
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 0L4 4m5.121 5.121L4 14"
          />
        </svg>
      ),
      query: "haircut",
    },
    {
      name: "Hair Color",
      price: "₹799",
      icon: (
        <svg
          className="w-6 h-6 text-indigo-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      ),
      query: "haircolor",
    },
    {
      name: "Facial",
      price: "₹499",
      icon: (
        <svg
          className="w-6 h-6 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      query: "facial",
    },
    {
      name: "Manicure",
      price: "₹299",
      icon: (
        <svg
          className="w-6 h-6 text-pink-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5a1.5 1.5 0 013 0v5m0 0V3a1.5 1.5 0 013 0v5.5"
          />
        </svg>
      ),
      query: "manicure",
    },
    {
      name: "Massage",
      price: "₹599",
      icon: (
        <svg
          className="w-6 h-6 text-teal-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      query: "massage",
    },
  ];

  return (
    <div className="md:hidden space-y-6 pb-6 pt-2">
      {/* Hero Header Section (Full-Width Background Image + Glassmorphism Overlay) */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-100 min-h-[300px] sm:min-h-[340px] flex items-center p-4 sm:p-7 bg-slate-900 my-1">
        {/* Full Width Background Salon Image */}
        <Image
          src={slider_img}
          alt="Salon Interior"
          fill
          className="object-cover rounded-3xl"
          priority
        />

        {/* Gradient Mask Overlay for Perfect Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-blue-950/40 pointer-events-none" />

        {/* Floating Glassmorphism Foreground Card */}
        <div className="relative z-10 max-w-[90%] sm:max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 space-y-3 text-white shadow-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold text-white border border-white/30">
            <span>✨</span>
            <span>Your Beauty, Our Priority</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-xl sm:text-3xl font-extrabold leading-tight tracking-tight text-white">
            Welcome to <br />
            <span className="text-blue-400 font-extrabold block text-2xl sm:text-4xl drop-shadow-xs">
              LockMyTime
            </span>
            <span className="text-gray-100 font-bold text-sm sm:text-xl">
              Glam Up with us
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs text-gray-200 leading-relaxed font-light line-clamp-2">
            Discover top-rated salons near you and book your appointment in
            seconds.
          </p>

          {/* User Proof Stack */}
          <div className="flex items-center gap-3 pt-0.5">
            <Image
              src={group}
              alt="happy users"
              className="w-20 sm:w-24 h-auto object-contain"
            />
            <div className="text-[11px] font-bold text-white">
              <span>2K+ Happy Customers</span>
            </div>
          </div>

          {/* Refer & Earn Promo Button with Attention-Grabbing Bouncing Animation */}
          <div className="pt-0.5">
            <Link
              href="/refer"
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-indigo-600/60 hover:bg-indigo-600/80 border border-indigo-300/50 hover:border-indigo-200 backdrop-blur-md transition-all duration-200 active:scale-95 shadow-lg shadow-indigo-950/40 animate-bounce hover:animate-none cursor-pointer"
            >
              <span className="text-xs transition-transform group-hover:scale-125">🎁</span>
              <span>Refer & Earn</span>
              <span className="inline-block text-[10px] bg-indigo-500 text-white font-extrabold px-1.5 py-0.2 rounded-full shadow-xs">
                ₹100
              </span>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row items-center gap-2.5 pt-1">
            <Link href="/shops" className="cursor-pointer">
              <button className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/40 active:scale-95 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-full transition-all flex items-center gap-2 cursor-pointer border border-blue-400/40">
                <span>Book Now</span>
                <Image
                  className="w-3 h-3 filter invert"
                  src={book_arrow}
                  alt="arrow"
                />
              </button>
            </Link>

            <Link
              href="https://www.instagram.com/reel/DbgLsNtS3iR/?utm_source=ig_web_copy_link&igsi=MzRlODBiNWFlZA=="
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <button className="flex items-center gap-1.5 bg-white/95 hover:bg-white text-gray-900 font-medium text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-full shadow-md active:scale-95 transition-all cursor-pointer border border-white/40">
                <svg
                  className="w-3.5 h-3.5 text-blue-600 shrink-0"
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
      </div>

      {/* 4 Feature Overlay Card Box */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 grid grid-cols-2 gap-3">
        <div className="flex items-start gap-2.5 p-2 rounded-xl bg-blue-50/60">
          <div className="p-1.5 bg-blue-100/70 text-blue-600 rounded-lg shrink-0">
            <svg
              className="w-4 h-4"
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
          <div>
            <p className="font-bold text-gray-900 text-xs">Near You</p>
            <p className="text-[10px] text-gray-500 leading-tight">
              Find salons nearby
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-2 rounded-xl bg-amber-50/60">
          <div className="p-1.5 bg-amber-100/70 text-amber-600 rounded-lg shrink-0">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-xs">Top Rated</p>
            <p className="text-[10px] text-gray-500 leading-tight">
              Choose top rated
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-2 rounded-xl bg-indigo-50/60">
          <div className="p-1.5 bg-indigo-100/70 text-indigo-600 rounded-lg shrink-0">
            <svg
              className="w-4 h-4"
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
          <div>
            <p className="font-bold text-gray-900 text-xs">Easy Booking</p>
            <p className="text-[10px] text-gray-500 leading-tight">
              Book in few clicks
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-2 rounded-xl bg-emerald-50/60">
          <div className="p-1.5 bg-emerald-100/70 text-emerald-600 rounded-lg shrink-0">
            <svg
              className="w-4 h-4"
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
          <div>
            <p className="font-bold text-gray-900 text-xs">Trusted & Safe</p>
            <p className="text-[10px] text-gray-500 leading-tight">
              Verified salons
            </p>
          </div>
        </div>
      </div>

      {/* POPULAR SERVICES Section */}
      <div className="space-y-3 pt-2">
        <div>
          <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">
            POPULAR SERVICES
          </p>
          <h2 className="text-xl font-extrabold text-gray-900">
            Explore Services
          </h2>
          <p className="text-xs text-gray-500">
            Find the perfect service for you
          </p>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-2xs shrink-0 flex flex-col items-center min-w-[105px] text-center active:scale-95 transition-transform"
            >
              <div className="p-2.5 bg-blue-50 rounded-xl mb-2">{cat.icon}</div>
              <p className="font-bold text-gray-900 text-xs">{cat.name}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Starting
                <span className="text-gray-700 font-semibold">{cat.price}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Rated Salons Near You */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base font-extrabold text-gray-900">
              Top Rated Salons Near You
            </h2>
            <p className="text-xs text-gray-500">
              Handpicked beauty & wellness spots
            </p>
          </div>
          <Link href="/shops" className="text-xs font-bold text-blue-600">
            View all &gt;
          </Link>
        </div>

        {/* Salon Cards Vertical List */}
        <div className="space-y-3">
          {shops && shops.length > 0 ? (
            shops.map((shop) => (
              <Link
                key={shop._id}
                href={`/shops/${shop._id}`}
                className="bg-white rounded-2xl p-3 border border-gray-100 shadow-2xs flex items-center gap-3 active:bg-gray-50 transition-colors block"
              >
                {/* Shop Image */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={
                      shop.image ||
                      "https://cdn3.iconfinder.com/data/icons/essential-rounded/64/Rounded-31-512.png"
                    }
                    alt={shop.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <span className="text-amber-400 text-xs">★</span>
                    <span>4.8</span>
                  </div>
                </div>

                {/* Shop Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-bold text-gray-900 text-sm truncate">
                    {shop.name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    {shop.address?.line1 || "Location Near You"}
                  </p>

                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-xs font-bold text-gray-900">
                      ₹{shop.fees}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                      20% OFF
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-gray-400">
                      ⭐ 4.8 (1.2K)
                    </span>
                    <span className="text-xs font-bold text-blue-600 hover:underline">
                      Book Slot →
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full">
              <ComingSoonArea />
            </div>
          )}
        </div>
      </div>

      {/* Trust & Stats Banner */}
      <StatsBanner />

      {/* CTA Banner Card (NO GIRL/PERSON IMAGE -> Appointment Calendar Graphic) */}
      <div className="relative bg-gradient-to-r from-blue-100/90 via-blue-50/70 to-indigo-50/80 rounded-3xl p-6 overflow-hidden border border-blue-100 shadow-xs space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight leading-snug">
            Ready to book your <br />
            beauty appointment?
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Join millions of happy customers and experience the best salons near
            you.
          </p>
        </div>

        {/* 3D Appointment Calendar Illustration Graphic (NO GIRL IMAGE) */}
        <div className="flex items-center justify-between pt-2">
          <Link href="/shops" className="cursor-pointer">
            <button className="bg-blue-600 active:scale-95 text-white font-semibold text-xs px-6 py-2.5 rounded-full shadow-md flex items-center gap-1.5 cursor-pointer">
              <span>Book Now</span>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </Link>

          {/* Graphical Calendar Icon */}
          <div className="w-16 h-16 bg-white rounded-2xl border-2 border-blue-500 shadow-md flex flex-col items-center justify-center relative rotate-3 shrink-0">
            <div className="w-8 h-1 bg-blue-500 rounded-full mb-1.5" />
            <svg
              className="w-7 h-7 text-blue-600"
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
            <div className="absolute -top-1.5 -right-1.5 bg-amber-400 border border-white text-white p-1 rounded-full shadow-xs">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileHomePage;
