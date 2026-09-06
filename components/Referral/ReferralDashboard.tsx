"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "@/lib/toast";
import MyReferralsList, { ReferredSalonItem } from "./MyReferralsList";

interface ReferralDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  profile: {
    phone: string;
    totalEarned: number;
    availableBalance: number;
    pendingBalance: number;
    withdrawnAmount: number;
    payoutMethod?: string;
    upiId?: string;
    upiPhone?: string;
  };
  referrals: ReferredSalonItem[];
}

const ReferralDashboard: React.FC<ReferralDashboardProps> = ({
  user,
  profile,
  referrals,
}) => {
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "REFERRALS">("OVERVIEW");
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(profile.phone);
    setCopied(true);
    toast.success("Referral phone number copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareInvite = () => {
    const inviteText = `Register your salon or beauty parlour on LockMyTime and grow your bookings! Use my referral phone number: ${profile.phone} during registration. Visit: https://lockmytime.shop/shop-owner`;

    if (navigator.share) {
      navigator
        .share({
          title: "Join LockMyTime Salon Partner Network",
          text: inviteText,
          url: "https://lockmytime.shop/shop-owner",
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(inviteText);
      toast.success("Invite message copied to clipboard!");
    }
  };

  return (
    <div className="py-6 sm:py-10 max-w-6xl mx-auto space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Ambient Blur Glows */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Refer & Earn Partner Hub
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Welcome, {user.name}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-lg leading-relaxed">
              Earn ₹100 for every verified salon you refer, plus ₹3 – ₹10 lifetime commission per booking (around ₹500 – ₹2,000 monthly)!
            </p>
          </div>

          {/* Referral Code / Phone Widget */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-3 sm:min-w-80 shadow-inner">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                Your Referral Phone Number
              </p>
              <p className="text-2xl sm:text-3xl font-black tracking-wider text-white font-mono mt-0.5">
                {profile.phone}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyPhone}
                className="flex-1 py-2 px-3 rounded-xl bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>{copied ? "Copied!" : "Copy Number"}</span>
              </button>

              <button
                type="button"
                onClick={handleShareInvite}
                className="py-2 px-3.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center justify-center gap-1.5 backdrop-blur-sm transition-all active:scale-95 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Counters Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Earned */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs border-b-2 border-b-blue-500">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500">Total Earned</p>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
              💰
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
            ₹{profile.totalEarned}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Verified earnings to date</p>
        </div>

        {/* Pending Earnings */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs border-b-2 border-b-amber-500">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500">Pending</p>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs font-bold">
              ⏳
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-600 mt-2">
            ₹{profile.pendingBalance}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Awaiting admin verification</p>
        </div>

        {/* Available to Withdraw */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs border-b-2 border-b-emerald-500">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500">Available Balance</p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">
              ⚡
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-2">
            ₹{profile.availableBalance}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Ready for UPI withdrawal</p>
        </div>

        {/* Total Withdrawn */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs border-b-2 border-b-indigo-500">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-500">Withdrawn</p>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">
              🏦
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-indigo-600 mt-2">
            ₹{profile.withdrawnAmount}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Paid out to your UPI</p>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-1 overflow-x-auto text-xs sm:text-sm font-bold">
        <button
          type="button"
          onClick={() => setActiveTab("OVERVIEW")}
          className={`pb-3 px-3 transition-all relative cursor-pointer ${
            activeTab === "OVERVIEW"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Overview
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("REFERRALS")}
          className={`pb-3 px-3 transition-all relative cursor-pointer flex items-center gap-1.5 ${
            activeTab === "REFERRALS"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <span>My Referrals</span>
          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold">
            {referrals.length}
          </span>
        </button>

        <Link
          href="/refer/dashboard/earnings"
          className="pb-3 px-3 text-gray-500 hover:text-gray-900 transition-colors"
        >
          Earnings & Ledger
        </Link>

        <Link
          href="/refer/dashboard/withdraw"
          className="pb-3 px-3 text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1"
        >
          <span>Withdraw</span>
          {profile.availableBalance > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </Link>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "OVERVIEW" && (
        <div className="space-y-6">
          {/* Quick Actions & Recent Referrals */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Recent Referrals */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Recent Referred Salons
                </h3>
                {referrals.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("REFERRALS")}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    View All ({referrals.length}) →
                  </button>
                )}
              </div>

              {referrals.length > 0 ? (
                <div className="space-y-3">
                  {referrals.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                          🏪
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">
                            {item.shop?.name || "Salon Partner"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.totalBookingsCompleted} bookings completed
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-emerald-600 text-sm">
                          ₹{item.totalEarnedFromSalon}
                        </p>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            item.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {item.status === "ACTIVE" ? "Active" : "Pending"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 text-center space-y-2">
                  <p className="text-sm font-bold text-gray-900">
                    No referred salons yet
                  </p>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Give your referral phone number to a salon owner to get started!
                  </p>
                </div>
              )}
            </div>

            {/* Right 1 Col: Quick Payout Action Card */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 text-white flex flex-col justify-between space-y-4 shadow-lg">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                  Instant Payouts
                </span>
                <h4 className="text-lg font-bold text-white mt-1">
                  Ready to Cash Out?
                </h4>
                <p className="text-xs text-indigo-200 mt-1 leading-relaxed">
                  Withdraw your available earnings directly to your UPI ID or phone number.
                </p>

                <div className="mt-4 p-3.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-xs">
                  <p className="text-xs text-indigo-300">Available to Withdraw</p>
                  <p className="text-2xl font-black text-emerald-400 mt-0.5">
                    ₹{profile.availableBalance}
                  </p>
                </div>
              </div>

              <Link
                href="/refer/dashboard/withdraw"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <span>Request UPI Withdrawal</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* How Refer & Earn Works Guide */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900">
              How You Earn with LockMyTime
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100/80">
                <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs mb-2 shadow-xs">
                  1
                </span>
                <p className="font-bold text-gray-900 text-sm">1. Refer a Salon</p>
                <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                  Tell the salon or spa owner to register on LockMyTime and enter your mobile number <span className="font-bold text-blue-600 font-mono">({profile.phone})</span>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100/80">
                <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs mb-2 shadow-xs">
                  2
                </span>
                <p className="font-bold text-gray-900 text-sm">2. Get ₹100 Reward</p>
                <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                  When the admin verifies the salon, ₹100 is immediately credited to your available balance.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100/80">
                <span className="w-7 h-7 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-xs mb-2 shadow-xs">
                  3
                </span>
                <p className="font-bold text-gray-900 text-sm">3. Earn ₹3 – ₹10 Per Booking</p>
                <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                  Earn ₹3 – ₹10 for every completed customer booking (around ₹500 – ₹2,000 monthly passive income). Withdraw anytime!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MY REFERRALS TAB */}
      {activeTab === "REFERRALS" && (
        <MyReferralsList referrals={referrals} userPhone={profile.phone} />
      )}
    </div>
  );
};

export default ReferralDashboard;
