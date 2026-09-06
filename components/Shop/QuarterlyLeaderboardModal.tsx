"use client";

import React, { useEffect, useState } from "react";

export interface LeaderboardEntry {
  rank: number;
  name: string;
  bookings: number;
  prize: string;
  isCurrent: boolean;
}

interface QuarterlyLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopName?: string;
  quarter?: string;
  leaderboard?: LeaderboardEntry[];
  isUpcoming?: boolean;
  competitionStartDate?: string;
  daysUntilStart?: number;
  cohortName?: string;
}

const QuarterlyLeaderboardModal: React.FC<QuarterlyLeaderboardModalProps> = ({
  isOpen,
  onClose,
  shopName = "Your Salon",
  quarter = "Q4 • 2026",
  leaderboard,
  isUpcoming = false,
  competitionStartDate,
  daysUntilStart = 30,
  cohortName = "Cohort #1",
}) => {
  const [mounted, setMounted] = useState(false);

  const formattedStartDate = competitionStartDate
    ? new Date(competitionStartDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "06 Oct 2026";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const displayLeaderboard =
    leaderboard && leaderboard.length > 0
      ? leaderboard
      : [
          {
            rank: 1,
            name: "Luxe Studio & Spa",
            bookings: 156,
            prize: "₹5,000 – ₹10,000",
            isCurrent: false,
          },
          {
            rank: 2,
            name: "Glamour Haven Unisex",
            bookings: 142,
            prize: "₹2,000 – ₹5,000",
            isCurrent: false,
          },
          {
            rank: 3,
            name: shopName,
            bookings: 128,
            prize: "₹1,000 – ₹2,000",
            isCurrent: true,
          },
          {
            rank: 4,
            name: "Urban Cuts & Glow",
            bookings: 115,
            prize: "-",
            isCurrent: false,
          },
          {
            rank: 5,
            name: "Royal Touch Salon",
            bookings: 98,
            prize: "-",
            isCurrent: false,
          },
        ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-all duration-300 animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden text-left transition-all duration-300 transform scale-100 animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm font-bold transition-all active:scale-90 cursor-pointer"
          >
            ✕
          </button>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white/20 text-base">
              🏆
            </span>
            <div>
              <h3 className="text-lg font-black tracking-tight">
                Quarterly Leaderboard
              </h3>
              <p className="text-xs text-indigo-100">
                {quarter} Regional Ranking
              </p>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4">
          {/* Informative Waiting Period Banner */}
          {isUpcoming && (
            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-xs text-indigo-950 space-y-1">
              <div className="flex items-center gap-1.5 font-extrabold text-indigo-900">
                <span>⏳</span>
                <span>30-Day Preparation Period Active</span>
              </div>
              <p className="text-[11px] text-indigo-700 leading-relaxed">
                Competition officially starts on{" "}
                <strong className="text-indigo-900 font-bold">{formattedStartDate}</strong> (in {daysUntilStart} days).
                All bookings completed after start date will update your rank live!
              </p>
            </div>
          )}

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-center gap-2.5">
            <span className="text-lg">🎁</span>
            <div>
              <p className="font-bold">Quarterly Top 3 Prize Pool</p>
              <p className="text-[11px] text-amber-800 leading-snug">
                🥇 1st: <span className="font-extrabold text-amber-950">₹5,000 – ₹10,000</span> • 🥈 2nd: <span className="font-extrabold text-amber-950">₹2,000 – ₹5,000</span> • 🥉 3rd: <span className="font-extrabold text-amber-950">₹1,000 – ₹2,000</span>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {isUpcoming ? "Initial Seeded Standings" : "Current Standings"}
            </p>

            <div className="space-y-1.5">
              {displayLeaderboard.map((item) => (
                <div
                  key={item.rank}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    item.isCurrent
                      ? "bg-indigo-50/90 border-indigo-200 shadow-2xs font-semibold"
                      : "bg-slate-50/70 border-gray-100 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                        item.rank === 1
                          ? "bg-amber-400 text-amber-950"
                          : item.rank === 2
                            ? "bg-slate-200 text-slate-800"
                            : item.rank === 3
                              ? "bg-amber-700 text-white"
                              : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.rank}
                    </span>
                    <div>
                      <p
                        className={`text-xs font-bold ${item.isCurrent ? "text-indigo-950" : "text-gray-900"}`}
                      >
                        {item.name}{" "}
                        {item.isCurrent && (
                          <span className="ml-1 text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                            You
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {item.bookings} completed bookings
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold ${item.rank === 1 ? "text-emerald-600" : "text-gray-600"}`}
                  >
                    {item.prize}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-800 font-bold text-xs transition-all cursor-pointer"
          >
            Close Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuarterlyLeaderboardModal;
