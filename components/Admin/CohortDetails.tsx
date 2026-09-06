"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "@/lib/toast";

export interface CohortParticipantRank {
  rank: number;
  shopId: string;
  shopName: string;
  ownerName: string;
  ownerPhone: string;
  completedBookings: number;
  rewardAmount: number;
  isWinner: boolean;
  tieBrokenBy?: string;
  shopRegisteredAt?: string;
}

export interface CohortDetailsData {
  id: string;
  cohortNumber: number;
  name: string;
  entryWindowStart: string;
  entryWindowEnd: string;
  competitionStartDate: string;
  competitionEndDate: string;
  status: "UPCOMING" | "ACTIVE" | "COMPLETED";
  participantCount: number;
  rewardsConfig: {
    firstPlace: number;
    secondPlace: number;
    thirdPlace: number;
  };
  completedAt?: string;
}

interface CohortDetailsProps {
  cohort: CohortDetailsData;
  isFinalized: boolean;
  snapshottedAt?: string;
  rankings: CohortParticipantRank[];
  totalParticipants: number;
}

export default function CohortDetails({
  cohort,
  isFinalized,
  snapshottedAt,
  rankings,
  totalParticipants,
}: CohortDetailsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "WINNERS" | "PARTICIPANTS">("ALL");

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredRankings = rankings.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.shopName.toLowerCase().includes(q) ||
      item.ownerName.toLowerCase().includes(q) ||
      item.ownerPhone.includes(q) ||
      item.shopId.includes(q);

    const matchesFilter =
      filterType === "ALL" ||
      (filterType === "WINNERS" && item.isWinner) ||
      (filterType === "PARTICIPANTS" && !item.isWinner);

    return matchesSearch && matchesFilter;
  });

  const top1 = rankings.find((r) => r.rank === 1);
  const top2 = rankings.find((r) => r.rank === 2);
  const top3 = rankings.find((r) => r.rank === 3);

  const isActive = cohort.status === "ACTIVE";
  const isCompleted = cohort.status === "COMPLETED";

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard!`);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Nav & Breadcrumbs */}
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/admin/competitions"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors"
        >
          <span>←</span>
          <span>Back to All Cohorts</span>
        </Link>

        {isFinalized && snapshottedAt && (
          <span className="text-[11px] font-medium text-gray-400">
            Snapshot permanently locked on {formatDateTime(snapshottedAt)}
          </span>
        )}
      </div>

      {/* Cohort Header Card */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-gray-100 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-black text-white shadow-xs ${
                isActive
                  ? "bg-emerald-600"
                  : isCompleted
                  ? "bg-amber-500"
                  : "bg-gray-700"
              }`}
            >
              {cohort.cohortNumber}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  {cohort.name}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    isActive
                      ? "border border-emerald-300 bg-emerald-50 text-emerald-800"
                      : isCompleted
                      ? "border border-amber-300 bg-amber-50 text-amber-800"
                      : "border border-gray-200 bg-gray-50 text-gray-600"
                  }`}
                >
                  {isActive ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Live Competition</span>
                    </>
                  ) : isCompleted ? (
                    <>
                      <span>🏆</span>
                      <span>Final Standings Stored</span>
                    </>
                  ) : (
                    <>
                      <span>⏳</span>
                      <span>Upcoming Batch</span>
                    </>
                  )}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {totalParticipants} Participating Salons competing for ₹
                {(
                  (cohort.rewardsConfig?.firstPlace || 10000) +
                  (cohort.rewardsConfig?.secondPlace || 5000) +
                  (cohort.rewardsConfig?.thirdPlace || 2000)
                ).toLocaleString("en-IN")}{" "}
                total cash rewards.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="inline-flex items-center gap-1 text-xs font-extrabold bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-xl shadow-2xs">
              <span>🎁</span>
              <span>1st: ₹{cohort.rewardsConfig?.firstPlace?.toLocaleString("en-IN")}</span>
              <span className="text-gray-300">•</span>
              <span>2nd: ₹{cohort.rewardsConfig?.secondPlace?.toLocaleString("en-IN")}</span>
              <span className="text-gray-300">•</span>
              <span>3rd: ₹{cohort.rewardsConfig?.thirdPlace?.toLocaleString("en-IN")}</span>
            </span>
          </div>
        </div>

        {/* Schedule & Rules Timeline Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50/80 p-4 rounded-2xl border border-gray-100 text-xs">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Entry Window
            </p>
            <p className="font-bold text-gray-900 mt-0.5">
              {formatDate(cohort.entryWindowStart)} – {formatDate(cohort.entryWindowEnd)}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Competition Period
            </p>
            <p className="font-bold text-gray-900 mt-0.5">
              {formatDate(cohort.competitionStartDate)} – {formatDate(cohort.competitionEndDate)}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Status Mode
            </p>
            <p className="font-bold text-gray-900 mt-0.5">
              {isFinalized ? "Permanent Snapshot" : "Dynamic Live Counting"}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Ranking Rule
            </p>
            <p className="font-bold text-gray-900 mt-0.5">
              Completed Bookings (Speed Tie-Break)
            </p>
          </div>
        </div>
      </div>

      {/* TOP 3 PODIUM SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-1.5">
            <span>🏆</span>
            <span>{isCompleted ? "Competition Champions (Podium)" : "Current Live Leaders (Top 3)"}</span>
          </h2>
          <span className="text-xs font-semibold text-gray-400">
            {isCompleted ? "Final Cash Awards" : "Projected Rewards"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1st Place Podium Card */}
          <div className="relative overflow-hidden rounded-3xl border border-amber-300 bg-gradient-to-br from-amber-50 via-yellow-50/40 to-orange-50 p-5 shadow-xs flex flex-col justify-between gap-4">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 bg-amber-500 text-white font-black text-xs px-2.5 py-1 rounded-xl shadow-2xs">
                  <span>🥇</span>
                  <span>1st Place Winner</span>
                </span>
                <span className="font-black text-amber-900 text-sm bg-amber-200/80 px-2.5 py-0.5 rounded-lg">
                  ₹{(cohort.rewardsConfig?.firstPlace || 10000).toLocaleString("en-IN")}
                </span>
              </div>

              {top1 ? (
                <div>
                  <h3 className="text-base font-black text-gray-900 tracking-tight truncate">
                    {top1.shopName}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5 font-medium">
                    Owner: <span className="font-bold text-gray-800">{top1.ownerName}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Phone: <span className="font-mono font-semibold">{top1.ownerPhone}</span>
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No participant yet</p>
              )}
            </div>

            <div className="pt-3 border-t border-amber-200/70 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  Completed Bookings
                </p>
                <p className="text-xl font-black text-gray-900 mt-0.5 font-mono">
                  {top1?.completedBookings || 0}
                </p>
              </div>
              {top1?.ownerPhone && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(top1.ownerPhone, "phone")}
                  className="px-2.5 py-1 text-[11px] font-bold bg-white text-gray-700 hover:bg-gray-100 rounded-lg border border-amber-200 shadow-2xs transition-colors cursor-pointer"
                >
                  Copy Phone
                </button>
              )}
            </div>
          </div>

          {/* 2nd Place Podium Card */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-gray-50/40 to-indigo-50/20 p-5 shadow-xs flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 bg-slate-700 text-white font-black text-xs px-2.5 py-1 rounded-xl shadow-2xs">
                  <span>🥈</span>
                  <span>2nd Place</span>
                </span>
                <span className="font-black text-slate-800 text-sm bg-slate-200 px-2.5 py-0.5 rounded-lg">
                  ₹{(cohort.rewardsConfig?.secondPlace || 5000).toLocaleString("en-IN")}
                </span>
              </div>

              {top2 ? (
                <div>
                  <h3 className="text-base font-black text-gray-900 tracking-tight truncate">
                    {top2.shopName}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5 font-medium">
                    Owner: <span className="font-bold text-gray-800">{top2.ownerName}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Phone: <span className="font-mono font-semibold">{top2.ownerPhone}</span>
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No participant yet</p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Completed Bookings
                </p>
                <p className="text-xl font-black text-gray-900 mt-0.5 font-mono">
                  {top2?.completedBookings || 0}
                </p>
              </div>
              {top2?.ownerPhone && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(top2.ownerPhone, "phone")}
                  className="px-2.5 py-1 text-[11px] font-bold bg-white text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-200 shadow-2xs transition-colors cursor-pointer"
                >
                  Copy Phone
                </button>
              )}
            </div>
          </div>

          {/* 3rd Place Podium Card */}
          <div className="relative overflow-hidden rounded-3xl border border-amber-700/20 bg-gradient-to-br from-amber-50/40 via-orange-50/20 to-yellow-50/30 p-5 shadow-xs flex flex-col justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 bg-amber-800 text-white font-black text-xs px-2.5 py-1 rounded-xl shadow-2xs">
                  <span>🥉</span>
                  <span>3rd Place</span>
                </span>
                <span className="font-black text-amber-900 text-sm bg-amber-100 px-2.5 py-0.5 rounded-lg">
                  ₹{(cohort.rewardsConfig?.thirdPlace || 2000).toLocaleString("en-IN")}
                </span>
              </div>

              {top3 ? (
                <div>
                  <h3 className="text-base font-black text-gray-900 tracking-tight truncate">
                    {top3.shopName}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5 font-medium">
                    Owner: <span className="font-bold text-gray-800">{top3.ownerName}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Phone: <span className="font-mono font-semibold">{top3.ownerPhone}</span>
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No participant yet</p>
              )}
            </div>

            <div className="pt-3 border-t border-amber-200/50 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                  Completed Bookings
                </p>
                <p className="text-xl font-black text-gray-900 mt-0.5 font-mono">
                  {top3?.completedBookings || 0}
                </p>
              </div>
              {top3?.ownerPhone && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(top3.ownerPhone, "phone")}
                  className="px-2.5 py-1 text-[11px] font-bold bg-white text-gray-700 hover:bg-gray-100 rounded-lg border border-amber-200 shadow-2xs transition-colors cursor-pointer"
                >
                  Copy Phone
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FULL PARTICIPANTS TABLE SECTION */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden space-y-4 p-5 sm:p-6">
        {/* Table Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-gray-900">
              All Participating Salons ({filteredRankings.length})
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {isFinalized
                ? "Showing permanently recorded final rankings."
                : "Showing live rank based on completed bookings inside competition dates."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
            {/* Filter */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl text-xs font-bold">
              {(["ALL", "WINNERS", "PARTICIPANTS"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    filterType === t
                      ? "bg-white text-blue-600 shadow-2xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {t === "ALL" ? "All" : t === "WINNERS" ? "Top 3 Winners" : "Other"}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search salon or phone..."
              className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-all min-w-[200px]"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50/90 text-gray-500 uppercase tracking-wider text-[10px] font-bold border-y border-gray-100">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Salon Name</th>
                <th className="py-3 px-4">Owner Name</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4 text-center">Completed Bookings</th>
                <th className="py-3 px-4 text-right">Cash Reward</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRankings.map((shop) => {
                const isTop3 = shop.rank <= 3 && shop.completedBookings > 0;
                return (
                  <tr
                    key={shop.shopId}
                    className={`hover:bg-gray-50/80 transition-colors ${
                      isTop3 ? "bg-amber-50/20 font-medium" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-xl font-black text-xs ${
                          shop.rank === 1
                            ? "bg-amber-400 text-amber-950 shadow-2xs"
                            : shop.rank === 2
                            ? "bg-slate-200 text-slate-800 shadow-2xs"
                            : shop.rank === 3
                            ? "bg-amber-700 text-white shadow-2xs"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {shop.rank === 1
                          ? "🥇"
                          : shop.rank === 2
                          ? "🥈"
                          : shop.rank === 3
                          ? "🥉"
                          : shop.rank}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-gray-900 text-xs truncate max-w-[200px]">
                        {shop.shopName}
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono truncate max-w-[200px]">
                        ID: {shop.shopId}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-gray-800">
                      {shop.ownerName}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-gray-700">
                      <div className="flex items-center gap-1.5">
                        <span>{shop.ownerPhone}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(shop.ownerPhone, "phone")}
                          title="Copy phone number"
                          className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                        >
                          📋
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-sm text-gray-900">
                      {shop.completedBookings}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {shop.rewardAmount > 0 ? (
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-black text-xs border border-emerald-200">
                          ₹{shop.rewardAmount.toLocaleString("en-IN")}
                        </span>
                      ) : (
                        <span className="text-gray-400 font-normal">-</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {shop.isWinner ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-[10px] border border-amber-300">
                          <span>👑 Winner</span>
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[11px]">Participant</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredRankings.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400 text-xs font-medium">
                    No participating salons match your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
