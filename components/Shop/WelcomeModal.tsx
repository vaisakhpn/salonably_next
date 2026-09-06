"use client";

import React, { useEffect, useState } from "react";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopName?: string;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  shopName,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in">
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-amber-200/80 overflow-hidden text-center transition-all duration-300 transform scale-100 animate-in zoom-in-95">
        
        {/* Top Decorative Ambient Header */}
        <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-indigo-600 px-6 pt-10 pb-8 text-white overflow-hidden">
          {/* Ambient Glow Bubbles */}
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/20 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-yellow-300/30 rounded-full blur-xl pointer-events-none" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center text-sm font-bold transition-all active:scale-90 cursor-pointer"
          >
            ✕
          </button>

          {/* Trophy Badge Icon with Pulse */}
          <div className="relative inline-flex items-center justify-center">
            <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-4xl shadow-lg animate-bounce">
              🏆
            </div>
            <div className="absolute -bottom-2 bg-yellow-400 text-yellow-950 font-black text-[10px] tracking-wider uppercase px-3 py-0.5 rounded-full shadow-md border border-yellow-200">
              First 100 Partner
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-4 drop-shadow-xs">
            🎉 Congratulations!
          </h2>

          <p className="text-xs sm:text-sm font-semibold text-amber-100 mt-1">
            {shopName ? `${shopName}, you’re` : "You’re"} one of the <span className="text-white font-extrabold underline decoration-yellow-300 underline-offset-2">First 100 Shops</span> on LockMyTime!
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-5 text-gray-700">
          {/* Main Lifetime Free Announcement Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-yellow-50/80 border border-amber-200 text-center space-y-2 shadow-inner">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-900 font-bold text-xs">
              <span>🏆</span>
              <span>VIP Founder Benefit</span>
            </div>
            
            <h3 className="text-lg sm:text-xl font-black text-gray-900">
              You’ve unlocked Lifetime FREE service.
            </h3>

            <div className="flex flex-col gap-1 text-xs sm:text-sm font-medium text-gray-600">
              <p className="font-semibold text-gray-800">
                No subscription fees. No recurring charges.
              </p>
              <p className="text-xs text-gray-500">
                This benefit is reserved exclusively for our first 100 partner shops.
              </p>
            </div>
          </div>

          {/* Key Feature Perks Grid */}
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3 rounded-xl bg-slate-50 border border-gray-100 flex items-center gap-2.5">
              <span className="text-lg">✨</span>
              <div>
                <p className="text-xs font-bold text-gray-900">100% Free</p>
                <p className="text-[10px] text-gray-500">Lifetime access</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-gray-100 flex items-center gap-2.5">
              <span className="text-lg">⚡</span>
              <div>
                <p className="text-xs font-bold text-gray-900">Zero Charges</p>
                <p className="text-[10px] text-gray-500">No hidden fees</p>
              </div>
            </div>
          </div>

          {/* Warm Welcome Footer Message */}
          <p className="text-sm font-bold text-gray-800 flex items-center justify-center gap-1">
            <span>Welcome to LockMyTime</span>
            <span className="text-rose-500 animate-pulse text-base">❤️</span>
          </p>

          {/* CTA Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 sm:py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-md shadow-blue-500/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:pointer-events-none mt-3"
          >
            <span>Let’s Grow Your Salon </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
