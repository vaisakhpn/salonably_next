"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "@/lib/toast";

interface ReferralManagementProps {
  initialMetrics: {
    totalReferrers: number;
    totalReferredSalons: number;
    pendingVerificationCount: number;
    activeReferralsCount: number;
    rejectedReferralsCount: number;
    totalRewardsPaid: number;
    totalCommissionsPaid: number;
    totalEarnedAcrossPlatform: number;
    pendingWithdrawalAmount: number;
    pendingWithdrawalCount: number;
    totalPaidOut: number;
    totalPaidOutCount: number;
    totalAvailableInProfiles: number;
  };
  initialPending: any[];
  initialReferrals: any[];
  initialSettings: {
    initialRewardAmount: number;
    bookingCommissionAmount: number;
    minWithdrawalAmount: number;
    isProgramActive: boolean;
  };
}

const ReferralManagement: React.FC<ReferralManagementProps> = ({
  initialMetrics,
  initialPending,
  initialReferrals,
  initialSettings,
}) => {
  const [activeTab, setActiveTab] = useState<"QUEUE" | "DIRECTORY" | "SETTINGS">("QUEUE");
  const [metrics, setMetrics] = useState(initialMetrics);
  const [pendingList, setPendingList] = useState(initialPending);
  const [referralsList, setReferralsList] = useState(initialReferrals);
  const [settings, setSettings] = useState(initialSettings);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  // Settings form states
  const [rewardAmount, setRewardAmount] = useState(initialSettings.initialRewardAmount.toString());
  const [commissionAmount, setCommissionAmount] = useState(initialSettings.bookingCommissionAmount.toString());
  const [minWithdrawal, setMinWithdrawal] = useState(initialSettings.minWithdrawalAmount.toString());
  const [isProgramActive, setIsProgramActive] = useState(initialSettings.isProgramActive);

  const handleVerify = async (referralId: string) => {
    setProcessingId(referralId);
    try {
      const res = await fetch("/api/admin/referrals/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralId, action: "VERIFY" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to verify referral.");
      }

      toast.success(data.message || "Referral verified and ₹100 reward credited!");
      // Remove from pending list
      setPendingList((prev) => prev.filter((item) => item.id !== referralId));
      // Refresh page data
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Error verifying referral.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (referralId: string) => {
    const note = prompt("Enter a reason for rejecting this referral (optional):");
    setProcessingId(referralId);
    try {
      const res = await fetch("/api/admin/referrals/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralId, action: "REJECT", adminNote: note || "" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reject referral.");
      }

      toast.success(data.message || "Referral marked as rejected.");
      setPendingList((prev) => prev.filter((item) => item.id !== referralId));
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Error rejecting referral.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);

    try {
      const res = await fetch("/api/admin/referrals/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initialRewardAmount: Number(rewardAmount),
          bookingCommissionAmount: Number(commissionAmount),
          minWithdrawalAmount: Number(minWithdrawal),
          isProgramActive,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update settings.");
      }

      toast.success(data.message || "Settings updated successfully!");
      setSettings(data.settings);
    } catch (err: any) {
      toast.error(err.message || "Error updating settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  const filteredReferrals = referralsList.filter((item) => {
    if (statusFilter === "ALL") return true;
    return item.status === statusFilter;
  });

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 rounded-3xl text-white shadow-md">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md mb-2 text-blue-200">
            <span>🎁</span> Admin Referral Control Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Referral & Earn Management
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-xl">
            Verify newly referred salons, audit ongoing booking commissions, and configure reward amounts.
          </p>
        </div>

        {metrics.pendingVerificationCount > 0 && (
          <div className="bg-amber-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 self-start sm:self-auto shadow-sm animate-pulse">
            <span>⚠️</span>
            <span>{metrics.pendingVerificationCount} Salons Awaiting Verification</span>
          </div>
        )}
      </div>

      {/* Metrics Row (4 Key Stats) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs border-b-2 border-b-blue-500">
          <p className="text-xs font-semibold text-gray-500">Registered Referrers</p>
          <p className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">
            {metrics.totalReferrers}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Active referral profiles</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs border-b-2 border-b-amber-500">
          <p className="text-xs font-semibold text-gray-500">Pending Verification</p>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-600 mt-1">
            {metrics.pendingVerificationCount}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Salons waiting for approval</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs border-b-2 border-b-emerald-500">
          <p className="text-xs font-semibold text-gray-500">Active Referrals</p>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-1">
            {metrics.activeReferralsCount}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Verified generating salons</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs border-b-2 border-b-purple-500">
          <p className="text-xs font-semibold text-gray-500">Total Commissions Paid</p>
          <p className="text-xl sm:text-2xl font-extrabold text-purple-600 mt-1">
            ₹{metrics.totalEarnedAcrossPlatform}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">₹{metrics.totalRewardsPaid} bonuses + ₹{metrics.totalCommissionsPaid} bookings</p>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-1 text-xs sm:text-sm font-bold">
        <button
          type="button"
          onClick={() => setActiveTab("QUEUE")}
          className={`pb-3 px-3 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "QUEUE"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <span>Verification Queue</span>
          {pendingList.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
              {pendingList.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("DIRECTORY")}
          className={`pb-3 px-3 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "DIRECTORY"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <span>All Referrals ({referralsList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("SETTINGS")}
          className={`pb-3 px-3 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === "SETTINGS"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <span>⚙️ Program Rates & Settings</span>
        </button>
      </div>

      {/* TAB 1: VERIFICATION QUEUE */}
      {activeTab === "QUEUE" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Salons Awaiting Admin Verification ({pendingList.length})
              </h2>
              <p className="text-xs text-gray-500">
                Clicking &quot;Verify&quot; activates the referral and automatically credits the ₹100 referral reward to the referrer.
              </p>
            </div>
          </div>

          {pendingList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-gray-100">
                      <Image
                        src={item.shop?.image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&auto=format&fit=crop&q=80"}
                        alt={item.shop?.name || "Salon"}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                          {item.shop?.name || "Salon Partner"}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Pending
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 mt-0.5">
                        Owner: <span className="font-semibold text-gray-800">{item.shop?.ownerName}</span> • Phone: <span className="font-mono text-gray-800">{item.shop?.phone}</span>
                      </p>

                      <p className="text-xs text-gray-500 mt-0.5">
                        Email: {item.shop?.email}
                      </p>
                    </div>
                  </div>

                  {/* Referrer Info Box */}
                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100/80 text-xs text-blue-900 space-y-1">
                    <p className="font-bold text-blue-950 flex items-center gap-1">
                      <span>👤</span>
                      <span>Referred By: {item.referrer?.name || "Member"}</span>
                    </p>
                    <p className="text-blue-800">
                      Referrer Phone: <span className="font-mono font-bold">{item.referrerPhone}</span>
                    </p>
                    <p className="text-[11px] text-blue-600">
                      Registered on: {formatDate(item.createdAt)} • Reward to credit: <span className="font-bold">₹{item.initialRewardAmount}</span>
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      disabled={processingId === item.id}
                      onClick={() => handleVerify(item.id)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <span>✓ Verify & Credit ₹{item.initialRewardAmount}</span>
                    </button>

                    <button
                      type="button"
                      disabled={processingId === item.id}
                      onClick={() => handleReject(item.id)}
                      className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-gray-700 font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
                    >
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-xl">
                ✓
              </div>
              <h3 className="text-base font-bold text-gray-900">Queue is Clear!</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                All registered referred salons have been verified or processed.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ALL REFERRALS DIRECTORY */}
      {activeTab === "DIRECTORY" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Referral Directory ({filteredReferrals.length})
              </h2>
              <p className="text-xs text-gray-500">
                Searchable directory of all salons and referrers on LockMyTime
              </p>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
              {["ALL", "ACTIVE", "PENDING_VERIFICATION", "REJECTED"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    statusFilter === st
                      ? "bg-white text-blue-600 font-bold shadow-2xs"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {st.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-slate-50 border-b border-gray-100 font-bold text-gray-900 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Salon / Shop</th>
                  <th className="p-4">Referrer</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Bookings</th>
                  <th className="p-4">Commission</th>
                  <th className="p-4">Total Earned</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReferrals.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-medium text-gray-900">
                      <p className="font-bold text-sm">{item.shop?.name || "Salon"}</p>
                      <p className="text-[11px] text-gray-500">{item.shop?.ownerName} • {item.shopPhone}</p>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-gray-900">{item.referrer?.name || "User"}</p>
                      <p className="text-[11px] text-blue-600 font-mono font-semibold">{item.referrerPhone}</p>
                      {item.profile?.upiId && (
                        <p className="text-[10px] text-gray-400 font-mono">UPI: {item.profile.upiId}</p>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : item.status === "PENDING_VERIFICATION"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {item.status === "ACTIVE" ? "Active" : item.status === "PENDING_VERIFICATION" ? "Pending" : "Rejected"}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-gray-900 text-sm">
                      {item.totalBookingsCompleted}
                    </td>

                    <td className="p-4 font-bold text-blue-600 text-sm">
                      ₹{item.totalCommissionEarned}
                    </td>

                    <td className="p-4 font-black text-emerald-600 text-sm">
                      ₹{item.totalEarnedFromSalon}
                    </td>

                    <td className="p-4 text-[11px] text-gray-400">
                      {formatDate(item.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PROGRAM SETTINGS */}
      {activeTab === "SETTINGS" && (
        <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
              Platform Configuration
            </span>
            <h2 className="text-xl font-bold text-gray-900 mt-1">
              Referral Program Rates & Limits
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Change the reward amounts or withdrawal limits platform-wide without code modifications.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Initial Salon Verification Reward (₹)
              </label>
              <input
                type="number"
                required
                min={0}
                value={rewardAmount}
                onChange={(e) => setRewardAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                One-time bonus credited to referrer upon admin salon verification (Default: ₹100).
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Booking Commission Per Completed Appointment (₹)
              </label>
              <input
                type="number"
                required
                min={0}
                value={commissionAmount}
                onChange={(e) => setCommissionAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Ongoing fixed commission awarded for every finished booking at a referred salon (Default: ₹5).
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Minimum Withdrawal Threshold (₹)
              </label>
              <input
                type="number"
                required
                min={1}
                value={minWithdrawal}
                onChange={(e) => setMinWithdrawal(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Minimum available balance required for a user to request a withdrawal (Default: ₹100).
              </p>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-gray-100">
              <input
                type="checkbox"
                id="programActive"
                checked={isProgramActive}
                onChange={(e) => setIsProgramActive(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
              <label htmlFor="programActive" className="text-xs font-bold text-gray-900 cursor-pointer">
                Enable Referral & Earn Program Globally
              </label>
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-60"
            >
              {savingSettings ? "Saving Settings..." : "Save Rate Changes"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ReferralManagement;
