"use client";

import React, { useEffect, useState } from "react";

interface QuarterlyWinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopName?: string;
  rewardAmount?: string | number;
  completedBookings?: number;
  quarter?: string;
  rank?: number;
}

const QuarterlyWinnerModal: React.FC<QuarterlyWinnerModalProps> = ({
  isOpen,
  onClose,
  shopName = "Vintage Elegance",
  rewardAmount = "₹5,000 – ₹10,000",
  completedBookings = 128,
  quarter = "Q3 • 2026",
  rank = 1,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const displayRewardAmount =
    typeof rewardAmount === "string"
      ? rewardAmount.startsWith("₹")
        ? rewardAmount
        : `₹${rewardAmount}`
      : `₹${rewardAmount.toLocaleString("en-IN")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in">
      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-amber-200/90 overflow-hidden text-center transition-all duration-300 transform scale-100 animate-in zoom-in-95">
        {/* Celebratory Gradient Banner */}
        <div className="relative bg-gradient-to-br from-amber-500 via-yellow-500 to-indigo-600 px-6 pt-10 pb-8 text-white overflow-hidden">
          {/* Subtle Ambient Glows */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-yellow-200/30 rounded-full blur-2xl pointer-events-none" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center text-sm font-bold transition-all active:scale-90 cursor-pointer"
          >
            ✕
          </button>

          {/* Trophy Graphic */}
          <div className="relative inline-flex items-center justify-center">
            <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-4xl shadow-xl animate-bounce">
              🏆
            </div>
            <div className="absolute -bottom-2 bg-white text-indigo-900 font-black text-[10px] tracking-wider uppercase px-3 py-0.5 rounded-full shadow-md border border-yellow-200">
              {quarter} Champion
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-4 text-white drop-shadow-xs">
            🎉 Congratulations, {shopName}!
          </h2>

          <p className="text-xs sm:text-sm font-bold text-amber-100 mt-1">
            🏆 You’re the{" "}
            <span className="text-white underline decoration-yellow-300 underline-offset-2">
              Top Shop
            </span>{" "}
            in your region!
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-5 text-gray-700">
          {/* Prize Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 via-yellow-50/60 to-orange-50/70 border border-amber-200/80 text-center space-y-2 shadow-inner">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Quarterly Performance Reward
            </p>
            <p className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {displayRewardAmount}
            </p>
            <p className="text-xs text-gray-600 font-medium">
              You’ve won{" "}
              <span className="font-bold text-gray-900">
                {displayRewardAmount}
              </span>{" "}
              in the LockMyTime Quarterly Top Shop Award.
            </p>
          </div>

          {/* Performance Summary Grid */}
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3 rounded-xl bg-slate-50 border border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                📊
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">
                  {completedBookings} Bookings
                </p>
                <p className="text-[10px] text-gray-500">
                  Completed this quarter
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
                {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Rank #{rank}</p>
                <p className="text-[10px] text-gray-500">
                  {rank === 1 ? "Regional Leader" : "Top Performer"}
                </p>
              </div>
            </div>
          </div>

          {/* Warm Thank You Note */}
          <p className="text-xs sm:text-sm font-bold text-gray-800 flex items-center justify-center gap-1.5 pt-1">
            <span>Thank you for growing with LockMyTime</span>
            <span className="text-rose-500 animate-pulse text-base">❤️</span>
          </p>

          {/* CTA Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 sm:py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-md shadow-blue-500/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Reward Details 🏆</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuarterlyWinnerModal;
