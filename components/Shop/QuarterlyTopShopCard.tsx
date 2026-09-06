"use client";

import React from "react";

interface QuarterlyTopShopCardProps {
  isWinner?: boolean;
  isUpcoming?: boolean;
  daysUntilStart?: number;
  competitionStartDate?: string;
  cohortName?: string;
  shopName?: string;
  rank?: number;
  completedBookings?: number;
  topRankBookings?: number;
  rewardWon?: string | number;
  maxReward?: string | number;
  quarter?: string;
  onViewLeaderboard?: () => void;
  onViewReward?: () => void;
}

const QuarterlyTopShopCard: React.FC<QuarterlyTopShopCardProps> = ({
  isWinner = false,
  isUpcoming = false,
  daysUntilStart = 30,
  competitionStartDate,
  cohortName = "Cohort #1",
  shopName,
  rank = 3,
  completedBookings = 0,
  topRankBookings = 1,
  rewardWon = "₹5,000 – ₹10,000",
  maxReward = "₹5,000 – ₹10,000",
  quarter = "Q4 • 2026",
  onViewLeaderboard,
  onViewReward,
}) => {
  const displayRewardWon =
    typeof rewardWon === "string"
      ? rewardWon.startsWith("₹")
        ? rewardWon
        : `₹${rewardWon}`
      : `₹${rewardWon.toLocaleString("en-IN")}`;

  const formattedStartDate = competitionStartDate
    ? new Date(competitionStartDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "06 Oct 2026";

  // ----------------------------------------------------
  // STATE B: WINNER STATE (Only shown when reward is awarded)
  // ----------------------------------------------------
  if (isWinner) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50/70 via-yellow-50/40 to-orange-50/50 p-5 shadow-xs transition-all hover:shadow-md">
        {/* Subtle Decorative Ambient Accents */}
        <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-amber-300/20 blur-xl pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-28 h-28 rounded-full bg-yellow-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10 space-y-3.5">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white text-base shadow-xs">
                🏆
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900 flex items-center gap-1.5">
                  <span>Quarterly Winner</span>
                  <span className="animate-pulse text-xs">🎉</span>
                </h3>
                <p className="text-[11px] font-medium text-amber-800">
                  {quarter} • Regional Award
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/70 bg-white/80 px-2.5 py-1 text-[11px] font-bold text-amber-900 shadow-2xs">
              <span>🥇</span>
              <span>Rank #1 Champion</span>
            </span>
          </div>

          {/* Main Prize & Congratulation Banner */}
          <div className="rounded-xl border border-amber-200/80 bg-white/90 p-3.5 backdrop-blur-xs shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  Congratulations!
                </p>
                <p className="text-xl sm:text-2xl font-black text-gray-900 mt-0.5">
                  You won {displayRewardWon}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Top shop in your region with{" "}
                  <span className="font-bold text-gray-800">
                    {completedBookings} completed bookings
                  </span>.
                </p>
              </div>

              <button
                type="button"
                onClick={onViewReward}
                className="inline-flex items-center justify-center gap-1.5 self-start sm:self-center rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all cursor-pointer whitespace-nowrap"
              >
                <span>View Reward</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // STATE C: UPCOMING / 30-DAY WAITING PERIOD STATE
  // ----------------------------------------------------
  if (isUpcoming) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/40 p-5 shadow-xs transition-all hover:shadow-md">
        {/* Subtle Background Glow */}
        <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-indigo-500/10 blur-xl pointer-events-none" />

        <div className="relative z-10 space-y-3.5">
          {/* Header Row */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white text-base shadow-xs animate-pulse">
                ⏳
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <span>Quarterly Top Shop</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300/60">
                    Starts in {daysUntilStart} {daysUntilStart === 1 ? "day" : "days"}
                  </span>
                </h3>
                <p className="text-[11px] text-gray-500">
                  {quarter} • {cohortName}
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200/70 bg-indigo-50/90 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700">
              <span>⚡</span>
              <span>Win ₹5,000 – ₹10,000</span>
            </span>
          </div>

          {/* Waiting Period Explanatory Box */}
          <div className="rounded-xl border border-indigo-100 bg-white/90 p-4 backdrop-blur-xs shadow-2xs space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-900 bg-indigo-50 border border-indigo-200/70 px-2.5 py-0.5 rounded-md">
                  <span>🔒</span>
                  <span>30-Day Preparation Period Active</span>
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  Launches on <strong className="text-indigo-600">{formattedStartDate}</strong>
                </span>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Your salon is enrolled! All appointments completed starting from{" "}
                <strong className="text-gray-900 font-semibold">{formattedStartDate}</strong> will
                automatically count towards your live leaderboard ranking and the{" "}
                <strong className="text-emerald-600 font-bold">₹5,000 – ₹10,000 top prize</strong>.
              </p>
            </div>

            {/* Preparation Roadmap */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-center">
              <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
                <p className="text-[10px] font-bold text-emerald-800">1. Enrolled</p>
                <p className="text-[11px] font-extrabold text-emerald-950 mt-0.5">✅ Qualified</p>
              </div>
              <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-200/80">
                <p className="text-[10px] font-bold text-amber-800">2. Waiting Period</p>
                <p className="text-[11px] font-extrabold text-amber-950 mt-0.5">{daysUntilStart}d remaining</p>
              </div>
              <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-100">
                <p className="text-[10px] font-bold text-indigo-800">3. Live Race</p>
                <p className="text-[11px] font-extrabold text-indigo-950 mt-0.5">{formattedStartDate}</p>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-xs">
              <p className="text-[11px] text-gray-500 font-medium">
                #1 wins <span className="font-bold text-emerald-600">₹5,000 – ₹10,000</span> • Top 3 win cash rewards!
              </p>

              <button
                type="button"
                onClick={onViewLeaderboard}
                className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
              >
                <span>View Rules & Participants</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // STATE A: PARTICIPATING / NORMAL LIVE COMPETITION
  // ----------------------------------------------------
  const isCurrentlyLeading = rank === 1 && completedBookings > 0;
  const progressPercent = isCurrentlyLeading
    ? 100
    : Math.min(
        100,
        Math.round((completedBookings / (topRankBookings || 1)) * 100),
      );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/30 p-5 shadow-xs transition-all hover:shadow-md">
      {/* Subtle Background Glow */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-indigo-500/5 blur-xl pointer-events-none" />

      <div className="relative z-10 space-y-3.5">
        {/* Header Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 text-base">
              🏆
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Quarterly Top Shop
              </h3>
              <p className="text-[11px] text-gray-500">
                {quarter} Regional Competition
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200/60 bg-indigo-50/80 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700">
            <span>⚡</span>
            <span>Win ₹5,000 – ₹10,000</span>
          </span>
        </div>

        {/* Content Box */}
        <div className="rounded-xl border border-gray-100 bg-white/80 p-3.5 backdrop-blur-xs shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-base font-extrabold text-gray-900 flex items-center gap-1.5">
                {isCurrentlyLeading ? (
                  <span>You’re #1 in your region! 🥇</span>
                ) : (
                  <span>You’re #{rank} in your region</span>
                )}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                <span className="font-bold text-blue-600 font-mono">
                  {completedBookings}
                </span>{" "}
                completed bookings this quarter.
              </p>
            </div>

            <div className="text-left sm:text-right">
              {isCurrentlyLeading ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-lg">
                  <span>🥇</span>
                  <span>Currently Leading</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 bg-slate-50 border border-gray-200/60 px-2.5 py-1 rounded-lg">
                  <span>🥇</span>
                  <span>
                    #1 has{" "}
                    <span className="font-bold text-gray-900 font-mono">
                      {topRankBookings}
                    </span>{" "}
                    bookings
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Booking Progress Pace Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-gray-400">
              <span>{isCurrentlyLeading ? "Leading Pace" : "Your pace vs Leader"}</span>
              <span className="font-bold text-gray-600">
                {progressPercent}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isCurrentlyLeading
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Footer CTA & Reward Info */}
          <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-xs">
            <p className="text-[11px] text-gray-500 font-medium">
              #1 wins <span className="font-bold text-emerald-600">₹5,000 – ₹10,000</span> • Top 3 win cash rewards!
            </p>

            <button
              type="button"
              onClick={onViewLeaderboard}
              className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
            >
              <span>View Leaderboard</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuarterlyTopShopCard;
