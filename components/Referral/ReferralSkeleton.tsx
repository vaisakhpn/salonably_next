"use client";

import React from "react";

/**
 * Basic Shimmer Pulse Block
 */
export const SkeletonBlock: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-200/80 rounded-xl ${className}`} />
);

/**
 * Skeleton for Hero Welcome Banner
 */
export const DashboardHeroSkeleton = () => (
  <div className="bg-gradient-to-r from-blue-600/80 via-indigo-600/80 to-purple-600/80 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden animate-pulse">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div className="space-y-3 flex-1">
        <div className="h-6 w-36 bg-white/20 rounded-full" />
        <div className="h-9 w-64 bg-white/30 rounded-xl" />
        <div className="h-4 w-full max-w-md bg-white/20 rounded-lg" />
      </div>

      <div className="bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 min-w-72">
        <div className="h-3 w-32 bg-white/20 rounded" />
        <div className="h-8 w-48 bg-white/30 rounded-lg" />
        <div className="flex gap-2 mt-1">
          <div className="h-9 flex-1 bg-white/30 rounded-xl" />
          <div className="h-9 w-24 bg-white/30 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

/**
 * Skeleton for the 4 Metrics Cards Grid
 */
export const StatsGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-3 animate-pulse"
      >
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 bg-slate-200 rounded" />
          <div className="w-9 h-9 rounded-xl bg-slate-200" />
        </div>
        <div className="h-8 w-32 bg-slate-300 rounded-lg" />
        <div className="h-3 w-40 bg-slate-100 rounded" />
      </div>
    ))}
  </div>
);

/**
 * Skeleton for Referred Salon Cards
 */
export const SalonCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-xs animate-pulse space-y-4">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-2xl bg-slate-200 shrink-0" />
        <div className="space-y-2">
          <div className="h-5 w-44 bg-slate-200 rounded" />
          <div className="h-3 w-32 bg-slate-100 rounded" />
          <div className="h-3 w-24 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="h-7 w-28 bg-slate-200 rounded-full shrink-0" />
    </div>

    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
      <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
        <div className="h-3 w-16 bg-slate-200 rounded" />
        <div className="h-5 w-12 bg-slate-300 rounded" />
      </div>
      <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
        <div className="h-3 w-16 bg-slate-200 rounded" />
        <div className="h-5 w-12 bg-slate-300 rounded" />
      </div>
      <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
        <div className="h-3 w-16 bg-slate-200 rounded" />
        <div className="h-5 w-12 bg-slate-300 rounded" />
      </div>
    </div>
  </div>
);

/**
 * Skeleton for Transaction Row
 */
export const TransactionRowSkeleton = () => (
  <div className="p-4 sm:p-5 flex items-center justify-between gap-4 animate-pulse">
    <div className="flex items-center gap-3.5 flex-1 min-w-0">
      <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
      <div className="space-y-2 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="h-5 w-24 bg-slate-200 rounded-full" />
          <div className="h-5 w-28 bg-slate-100 rounded" />
        </div>
        <div className="h-3 w-3/4 max-w-sm bg-slate-100 rounded" />
      </div>
    </div>
    <div className="space-y-1 text-right shrink-0">
      <div className="h-6 w-20 bg-slate-300 rounded-lg ml-auto" />
      <div className="h-3 w-16 bg-slate-100 rounded ml-auto" />
    </div>
  </div>
);

/**
 * Skeleton for Full Customer Referral Dashboard
 */
export const ReferralDashboardSkeleton = () => (
  <div className="py-6 sm:py-10 max-w-6xl mx-auto space-y-6">
    <DashboardHeroSkeleton />
    <StatsGridSkeleton />

    {/* Quick Action Navigation Buttons Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between animate-pulse">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
          <div className="space-y-2">
            <div className="h-4 w-36 bg-slate-200 rounded" />
            <div className="h-3 w-48 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="w-5 h-5 bg-slate-200 rounded-full" />
      </div>
      <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between animate-pulse">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
          <div className="space-y-2">
            <div className="h-4 w-36 bg-slate-200 rounded" />
            <div className="h-3 w-48 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="w-5 h-5 bg-slate-200 rounded-full" />
      </div>
    </div>

    {/* Referrals Section Skeleton */}
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-5 w-48 bg-slate-300 rounded" />
          <div className="h-3 w-64 bg-slate-100 rounded" />
        </div>
        <div className="h-9 w-40 bg-slate-100 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <SalonCardSkeleton />
        <SalonCardSkeleton />
      </div>
    </div>
  </div>
);

/**
 * Skeleton for Earnings & Transaction History Page
 */
export const EarningsHistorySkeleton = () => (
  <div className="py-6 sm:py-10 max-w-5xl mx-auto space-y-6">
    {/* Header Navigation Skeleton */}
    <div className="flex items-center justify-between animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-slate-200 rounded-full" />
        <div className="space-y-1.5">
          <div className="h-6 w-48 bg-slate-300 rounded" />
          <div className="h-3 w-32 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="h-9 w-32 bg-slate-200 rounded-full" />
    </div>

    {/* Summary Stats Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-2 animate-pulse">
          <div className="h-3 w-24 bg-slate-200 rounded" />
          <div className="h-8 w-28 bg-slate-300 rounded-lg" />
        </div>
      ))}
    </div>

    {/* Filter Pills Skeleton */}
    <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between gap-4 animate-pulse">
      <div className="h-4 w-32 bg-slate-200 rounded" />
      <div className="flex gap-2">
        <div className="h-8 w-16 bg-slate-200 rounded-lg" />
        <div className="h-8 w-20 bg-slate-100 rounded-lg" />
        <div className="h-8 w-24 bg-slate-100 rounded-lg" />
        <div className="h-8 w-24 bg-slate-100 rounded-lg" />
      </div>
    </div>

    {/* Ledger Rows Skeleton */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs divide-y divide-gray-100 overflow-hidden">
      {[1, 2, 3, 4, 5].map((i) => (
        <TransactionRowSkeleton key={i} />
      ))}
    </div>
  </div>
);

/**
 * Skeleton for Withdrawals & Payout Settings Page
 */
export const WithdrawPageSkeleton = () => (
  <div className="py-6 sm:py-10 max-w-4xl mx-auto space-y-6">
    {/* Header Skeleton */}
    <div className="flex items-center justify-between animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-slate-200 rounded-full" />
        <div className="space-y-1.5">
          <div className="h-6 w-48 bg-slate-300 rounded" />
          <div className="h-3 w-32 bg-slate-100 rounded" />
        </div>
      </div>
    </div>

    {/* Available Balance Hero Card Skeleton */}
    <div className="bg-gradient-to-r from-emerald-600/80 to-teal-700/80 rounded-3xl p-6 sm:p-8 text-white shadow-xl animate-pulse space-y-3">
      <div className="h-4 w-36 bg-white/20 rounded" />
      <div className="h-10 w-48 bg-white/40 rounded-xl" />
      <div className="h-4 w-64 bg-white/20 rounded" />
    </div>

    {/* 2-Column Grid Skeleton (UPI Settings & Withdrawal Form) */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4 animate-pulse">
        <div className="h-5 w-36 bg-slate-300 rounded" />
        <div className="h-3 w-48 bg-slate-100 rounded" />
        <div className="h-11 w-full bg-slate-100 rounded-xl" />
        <div className="h-10 w-full bg-slate-200 rounded-xl" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4 animate-pulse">
        <div className="h-5 w-36 bg-slate-300 rounded" />
        <div className="h-3 w-48 bg-slate-100 rounded" />
        <div className="h-11 w-full bg-slate-100 rounded-xl" />
        <div className="h-10 w-full bg-slate-200 rounded-xl" />
      </div>
    </div>

    {/* History Table Skeleton */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-4 animate-pulse">
      <div className="h-5 w-44 bg-slate-300 rounded" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-slate-50 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

/**
 * Skeleton for Referral Onboarding / Setup Page
 */
export const ReferralSetupSkeleton = () => (
  <div className="min-h-[75vh] flex items-center justify-center px-4 py-8">
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl max-w-lg w-full space-y-6 animate-pulse">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-slate-200 rounded-2xl mx-auto" />
        <div className="h-7 w-48 bg-slate-300 rounded-lg mx-auto" />
        <div className="h-4 w-72 bg-slate-100 rounded mx-auto" />
      </div>

      <div className="space-y-3">
        <div className="h-4 w-28 bg-slate-200 rounded" />
        <div className="h-12 w-full bg-slate-100 rounded-2xl" />
      </div>

      <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl">
        <div className="h-4 w-full bg-slate-200 rounded" />
        <div className="h-4 w-5/6 bg-slate-200 rounded" />
        <div className="h-4 w-4/6 bg-slate-200 rounded" />
      </div>

      <div className="h-12 w-full bg-slate-300 rounded-2xl" />
    </div>
  </div>
);

/**
 * Skeleton for Admin Referrals / Withdrawals Hub
 */
export const AdminReferralSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Stats Row */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-2">
          <div className="h-3 w-28 bg-slate-200 rounded" />
          <div className="h-7 w-24 bg-slate-300 rounded-lg" />
        </div>
      ))}
    </div>

    {/* Table Container Skeleton */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-6 w-48 bg-slate-300 rounded" />
        <div className="h-9 w-32 bg-slate-200 rounded-xl" />
      </div>
      <div className="space-y-3 pt-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-slate-50 rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);
