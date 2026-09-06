"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "@/lib/toast";

export interface CohortPreview {
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
  winnerPreview?: {
    shopName: string;
    ownerName: string;
    completedBookings: number;
    rewardAmount: number;
  } | null;
  leaderPreview?: {
    shopName: string;
    ownerName: string;
    completedBookings: number;
  } | null;
  completedAt?: string;
}

export interface CompetitionMetrics {
  totalCohorts: number;
  activeCohortsCount: number;
  completedCohortsCount: number;
  upcomingCohortsCount: number;
  totalParticipantsCount: number;
}

export interface CompetitionSettingsData {
  waitingPeriodDays: number;
  entryWindowDays: number;
  competitionDurationDays: number;
  rewards: {
    firstPlace: number;
    secondPlace: number;
    thirdPlace: number;
  };
  isCompetitionActive: boolean;
}

interface CompetitionManagementProps {
  initialMetrics: CompetitionMetrics;
  initialCohorts: CohortPreview[];
  initialSettings?: CompetitionSettingsData;
}

export default function CompetitionManagement({
  initialMetrics,
  initialCohorts,
  initialSettings = {
    waitingPeriodDays: 30,
    entryWindowDays: 15,
    competitionDurationDays: 90,
    rewards: {
      firstPlace: 10000,
      secondPlace: 5000,
      thirdPlace: 2000,
    },
    isCompetitionActive: true,
  },
}: CompetitionManagementProps) {
  const [metrics, setMetrics] = useState<CompetitionMetrics>(initialMetrics);
  const [cohorts, setCohorts] = useState<CohortPreview[]>(initialCohorts);
  const [settings, setSettings] = useState<CompetitionSettingsData>(initialSettings);
  const [activeTab, setActiveTab] = useState<"ALL" | "ACTIVE" | "COMPLETED" | "UPCOMING">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Form state for settings modal
  const [formSettings, setFormSettings] = useState<CompetitionSettingsData>(initialSettings);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/admin/competition/sync", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Competition sync completed successfully.");
        // Refresh cohorts list
        const refreshRes = await fetch("/api/admin/competition/cohorts");
        const refreshData = await refreshRes.json();
        if (refreshRes.ok) {
          setMetrics(refreshData.metrics);
          setCohorts(refreshData.cohorts);
        }
      } else {
        toast.error(data.message || "Failed to sync competition cohorts.");
      }
    } catch (error) {
      console.error("Sync error:", error);
      toast.error("Failed to sync competition cohorts.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch("/api/admin/competition/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formSettings),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Settings updated successfully!");
        setSettings(data.settings);
        setShowSettingsModal(false);
      } else {
        toast.error(data.message || "Failed to update settings.");
      }
    } catch (error) {
      console.error("Settings update error:", error);
      toast.error("Failed to update competition settings.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const filteredCohorts = cohorts.filter((c) => {
    const matchesTab = activeTab === "ALL" || c.status === activeTab;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      `cohort #${c.cohortNumber}`.toLowerCase().includes(q) ||
      c.winnerPreview?.shopName?.toLowerCase().includes(q) ||
      c.leaderPreview?.shopName?.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-amber-50 text-amber-600 text-lg">
              🏆
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Quarterly Top Shop Competitions
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Monitor rolling 15-day cohorts, live leaderboard pace, historical podiums, and performance rewards.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setFormSettings(settings);
              setShowSettingsModal(true);
            }}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-800 font-bold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <span>⚙️</span>
            <span>Configure Rules</span>
          </button>

          <button
            type="button"
            onClick={handleSync}
            disabled={isSyncing}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer whitespace-nowrap"
          >
            <svg
              className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>{isSyncing ? "Evaluating..." : "Sync & Evaluate"}</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Cohorts */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs border-b-2 border-b-blue-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Total Cohorts</span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs">📁</span>
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">{metrics.totalCohorts}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">All scheduled batches</p>
        </div>

        {/* Active Competitions */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs border-b-2 border-b-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700">Active</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs animate-pulse">⚡</span>
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-2">{metrics.activeCohortsCount}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Live competitions running</p>
        </div>

        {/* Completed Cohorts */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs border-b-2 border-b-purple-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-700">Completed</span>
            <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs">🏆</span>
          </div>
          <p className="text-2xl font-black text-purple-700 mt-2">{metrics.completedCohortsCount}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Finalized with snapshots</p>
        </div>

        {/* Upcoming Cohorts */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs border-b-2 border-b-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700">Upcoming</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs">⏳</span>
          </div>
          <p className="text-2xl font-black text-amber-700 mt-2">{metrics.upcomingCohortsCount}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Entry window enrolling</p>
        </div>

        {/* Total Participating Salons */}
        <div className="col-span-2 lg:col-span-1 bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs border-b-2 border-b-indigo-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-700">Total Salons</span>
            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs">🏢</span>
          </div>
          <p className="text-2xl font-black text-indigo-700 mt-2">{metrics.totalParticipantsCount}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Enrolled across cohorts</p>
        </div>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100/80 rounded-xl overflow-x-auto text-xs font-bold">
          {(["ALL", "ACTIVE", "COMPLETED", "UPCOMING"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-white text-blue-600 shadow-2xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab === "ALL"
                  ? `All (${metrics.totalCohorts})`
                  : tab === "ACTIVE"
                  ? `Active (${metrics.activeCohortsCount})`
                  : tab === "COMPLETED"
                  ? `Completed (${metrics.completedCohortsCount})`
                  : `Upcoming (${metrics.upcomingCohortsCount})`}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cohort or salon..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
          />
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Cohorts Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredCohorts.map((cohort) => {
          const isActive = cohort.status === "ACTIVE";
          const isCompleted = cohort.status === "COMPLETED";

          return (
            <div
              key={cohort.id}
              className={`relative overflow-hidden rounded-3xl border bg-white p-5 shadow-xs transition-all hover:shadow-md flex flex-col justify-between gap-4 ${
                isActive
                  ? "border-emerald-200/80 bg-gradient-to-br from-white via-emerald-50/10 to-teal-50/20"
                  : isCompleted
                  ? "border-amber-200/70 bg-gradient-to-br from-white via-amber-50/10 to-yellow-50/20"
                  : "border-gray-200/80"
              }`}
            >
              <div className="space-y-3.5">
                {/* Header Row: Cohort Name & Status Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-2xl text-sm font-black shadow-2xs ${
                        isActive
                          ? "bg-emerald-500 text-white"
                          : isCompleted
                          ? "bg-amber-500 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {cohort.cohortNumber}
                    </span>
                    <div>
                      <h3 className="text-sm font-black text-gray-900 tracking-tight">
                        {cohort.name}
                      </h3>
                      <p className="text-[11px] font-semibold text-gray-500">
                        {cohort.participantCount} Participating Salons
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      isActive
                        ? "border border-emerald-300/80 bg-emerald-50 text-emerald-800"
                        : isCompleted
                        ? "border border-amber-300/80 bg-amber-50 text-amber-800"
                        : "border border-gray-200 bg-gray-50 text-gray-600"
                    }`}
                  >
                    {isActive ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Active</span>
                      </>
                    ) : isCompleted ? (
                      <>
                        <span>🏆</span>
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <span>⏳</span>
                        <span>Upcoming</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Timeline Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50/70 p-3 rounded-2xl border border-gray-100">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Entry Window
                    </p>
                    <p className="font-semibold text-gray-800 mt-0.5 text-[11px]">
                      {formatDate(cohort.entryWindowStart)} – {formatDate(cohort.entryWindowEnd)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Competition Period
                    </p>
                    <p className="font-semibold text-gray-800 mt-0.5 text-[11px]">
                      {formatDate(cohort.competitionStartDate)} – {formatDate(cohort.competitionEndDate)}
                    </p>
                  </div>
                </div>

                {/* Highlight Banner: Winner or Leader Preview */}
                {isCompleted && cohort.winnerPreview && (
                  <div className="rounded-xl border border-amber-200/90 bg-amber-50/80 p-3 text-xs text-amber-950 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base">🥇</span>
                      <div className="truncate">
                        <p className="font-black truncate">{cohort.winnerPreview.shopName}</p>
                        <p className="text-[10px] text-amber-800 font-medium">
                          {cohort.winnerPreview.completedBookings} completed bookings
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-md text-[11px] shrink-0">
                      ₹{cohort.winnerPreview.rewardAmount?.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                {isActive && cohort.leaderPreview && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-950 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base">⚡</span>
                      <div className="truncate">
                        <p className="font-black truncate">Leader: {cohort.leaderPreview.shopName}</p>
                        <p className="text-[10px] text-emerald-800 font-medium">
                          {cohort.leaderPreview.completedBookings} bookings in progress
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-800 text-[10px] uppercase bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
                      Live
                    </span>
                  </div>
                )}
              </div>

              {/* Action Link Footer */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-medium">
                  Prize pool up to ₹10,000
                </span>

                <Link
                  href={`/admin/competitions/${cohort.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
                >
                  <span>View Details</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          );
        })}

        {filteredCohorts.length === 0 && (
          <div className="col-span-full bg-white rounded-3xl border border-gray-100 p-12 text-center text-gray-400">
            <span className="text-3xl">🏆</span>
            <p className="text-sm font-bold text-gray-700 mt-2">No cohorts found</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Click &quot;Sync &amp; Evaluate&quot; above to backfill existing salons and provision upcoming cohorts.
            </p>
          </div>
        )}
      </div>

      {/* SETTINGS & REWARDS CONFIGURATION MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden text-left animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white relative">
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
              >
                ✕
              </button>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-white/20 rounded-xl text-lg">⚙️</span>
                <div>
                  <h3 className="text-lg font-black tracking-tight">Competition Rules &amp; Rewards</h3>
                  <p className="text-xs text-indigo-100">Configure global parameters for upcoming cohorts</p>
                </div>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveSettings} className="p-6 space-y-4">
              {/* Cash Reward Amounts */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Cash Rewards Pool (₹)
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <span className="text-[11px] font-bold text-amber-800">🥇 1st Place</span>
                    <input
                      type="number"
                      min={0}
                      value={formSettings.rewards.firstPlace}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          rewards: {
                            ...formSettings.rewards,
                            firstPlace: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full mt-1 px-3 py-2 text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-700">🥈 2nd Place</span>
                    <input
                      type="number"
                      min={0}
                      value={formSettings.rewards.secondPlace}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          rewards: {
                            ...formSettings.rewards,
                            secondPlace: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full mt-1 px-3 py-2 text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-amber-900">🥉 3rd Place</span>
                    <input
                      type="number"
                      min={0}
                      value={formSettings.rewards.thirdPlace}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          rewards: {
                            ...formSettings.rewards,
                            thirdPlace: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full mt-1 px-3 py-2 text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Schedule Duration Parameters */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-gray-700">Waiting Period</label>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      min={0}
                      value={formSettings.waitingPeriodDays}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          waitingPeriodDays: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2">
                      days
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700">Entry Window</label>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      min={1}
                      value={formSettings.entryWindowDays}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          entryWindowDays: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2">
                      days
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700">Comp. Length</label>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      min={1}
                      value={formSettings.competitionDurationDays}
                      onChange={(e) =>
                        setFormSettings({
                          ...formSettings,
                          competitionDurationDays: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2">
                      days
                    </span>
                  </div>
                </div>
              </div>

              {/* Program Active Status */}
              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <p className="text-xs font-bold text-gray-800">Competition Program Status</p>
                  <p className="text-[11px] text-gray-400">Enable or pause rolling cohort enrollment</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formSettings.isCompetitionActive}
                    onChange={(e) =>
                      setFormSettings({
                        ...formSettings,
                        isCompetitionActive: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  {isSavingSettings ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
