"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

interface ComingSoonAreaProps {
  query?: string;
  onResetSearch?: () => void;
}

const ComingSoonArea: React.FC<ComingSoonAreaProps> = ({
  query,
  onResetSearch,
}) => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      toast.error("Please enter your email or phone number.");
      return;
    }
    setSubmitted(true);
    toast.success("Thank you! We will notify you as soon as we launch in this area.");
    setEmailOrPhone("");
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-indigo-50/30 to-white rounded-3xl border border-blue-100/80 p-6 sm:p-14 text-center shadow-sm max-w-4xl mx-auto my-6">
      {/* Decorative Glow Background Effects */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 space-y-6">
        {/* Animated Location Pin Badge */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="absolute -inset-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl blur-md opacity-25 animate-pulse" />
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl shadow-md border border-blue-100 flex items-center justify-center text-blue-600 transition-transform hover:scale-105 duration-300">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-semibold tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span>Expanding Rapidly</span>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            We are coming soon in{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              this Area.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            {query ? (
              <>
                No registered shops or salons found for{" "}
                <span className="font-semibold text-gray-900 bg-blue-100/60 px-2 py-0.5 rounded-md border border-blue-200/50">
                  "{query}"
                </span>{" "}
                yet. We are actively onboarding top-tier salons in your area!
              </>
            ) : (
              "We haven't launched partner salons in this location yet. Our team is actively expanding to bring top beauty professionals to your neighborhood!"
            )}
          </p>
        </div>

        {/* Interactive Form */}
        <div className="pt-2 max-w-md mx-auto">
          {submitted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-medium flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5 text-emerald-600 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>You're on our priority list! We'll notify you when we launch.</span>
            </div>
          ) : (
            <form
              onSubmit={handleNotifySubmit}
              className="flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Enter email or phone for launch updates..."
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full px-4 py-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-xs transition-all placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-full shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer active:scale-95"
              >
                Notify Me
              </button>
            </form>
          )}
        </div>

        {/* Action & Trust Highlights */}
        <div className="pt-4 flex flex-col items-center gap-6">
          <Link
            href="/shops"
            onClick={onResetSearch}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-all shadow-xs hover:border-gray-300 cursor-pointer"
          >
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Explore All Salons</span>
          </Link>

          {/* Highlights */}
          <div className="grid grid-cols-3 gap-3 sm:gap-8 pt-4 border-t border-gray-200/60 w-full max-w-lg mx-auto">
            <div className="text-center space-y-1">
              <p className="text-base sm:text-lg font-bold text-gray-900">
                50+
              </p>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium">
                Cities Expanding
              </p>
            </div>
            <div className="text-center space-y-1 border-x border-gray-200/60 px-2">
              <p className="text-base sm:text-lg font-bold text-gray-900">
                100%
              </p>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium">
                Verified Salons
              </p>
            </div>
            <div className="text-center space-y-1">
              <p className="text-base sm:text-lg font-bold text-gray-900">
                Instant
              </p>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium">
                Slot Booking
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonArea;
