"use client";

import React, { useState } from "react";
import Image from "next/image";

export interface ReferredSalonItem {
  id: string;
  referredShopId: string;
  referrerPhone: string;
  shopPhone: string;
  status: "PENDING_VERIFICATION" | "ACTIVE" | "REJECTED";
  initialRewardAmount: number;
  initialRewardStatus: "PENDING" | "CREDITED" | "REJECTED";
  totalBookingsCompleted: number;
  totalCommissionEarned: number;
  totalEarnedFromSalon: number;
  verifiedAt?: string;
  createdAt: string;
  shop?: {
    id: string;
    name: string;
    ownerName: string;
    phone: string;
    email: string;
    image: string;
    address?: {
      line1?: string;
      line2?: string;
    };
    available?: boolean;
  } | null;
}

interface MyReferralsListProps {
  referrals: ReferredSalonItem[];
  userPhone: string;
}

const MyReferralsList: React.FC<MyReferralsListProps> = ({ referrals, userPhone }) => {
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "PENDING_VERIFICATION" | "REJECTED">("ALL");

  const filteredList = referrals.filter((item) => {
    if (filter === "ALL") return true;
    return item.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active Partner
          </span>
        );
      case "PENDING_VERIFICATION":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Verification Pending
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            Referred Salons ({referrals.length})
          </h3>
          <p className="text-xs text-gray-500">
            Track verification progress and live booking commission per salon
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filter === "ALL"
                ? "bg-white text-blue-600 font-bold shadow-2xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All ({referrals.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("ACTIVE")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filter === "ACTIVE"
                ? "bg-white text-emerald-600 font-bold shadow-2xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Active ({referrals.filter((r) => r.status === "ACTIVE").length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("PENDING_VERIFICATION")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filter === "PENDING_VERIFICATION"
                ? "bg-white text-amber-600 font-bold shadow-2xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Pending ({referrals.filter((r) => r.status === "PENDING_VERIFICATION").length})
          </button>
        </div>
      </div>

      {/* Referrals Cards Grid */}
      {filteredList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredList.map((item) => {
            const shop = item.shop;
            const shopImg =
              shop?.image ||
              "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&auto=format&fit=crop&q=80";

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all p-4 sm:p-5 flex flex-col justify-between space-y-4"
              >
                {/* Shop Header Row */}
                <div className="flex items-start gap-3.5">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-gray-100">
                    <Image
                      src={shopImg}
                      alt={shop?.name || "Salon"}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                        {shop?.name || "Salon Partner"}
                      </h4>
                      {getStatusBadge(item.status)}
                    </div>

                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      Owner: <span className="font-medium text-gray-700">{shop?.ownerName || "Partner"}</span>
                      {shop?.address?.line2 ? ` • ${shop.address.line2}` : ""}
                    </p>

                    <p className="text-[11px] text-gray-400 mt-1">
                      Referred on: {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Earnings Breakdown Box */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-center">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">
                      Initial Reward
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">
                      ₹{item.initialRewardAmount}
                    </p>
                    <span
                      className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md ${
                        item.initialRewardStatus === "CREDITED"
                          ? "bg-emerald-100 text-emerald-700"
                          : item.initialRewardStatus === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.initialRewardStatus === "CREDITED"
                        ? "Credited"
                        : item.initialRewardStatus === "REJECTED"
                        ? "Rejected"
                        : "Pending"}
                    </span>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">
                      Bookings Done
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-blue-600 mt-0.5">
                      {item.totalBookingsCompleted}
                    </p>
                    <span className="text-[10px] text-gray-500">
                      ₹3 – ₹10 / booking
                    </span>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">
                      Total Earned
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-emerald-600 mt-0.5">
                      ₹{item.totalEarnedFromSalon}
                    </p>
                    <span className="text-[10px] text-gray-500">
                      from this salon
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-8 sm:p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl">
            🏪
          </div>
          <div className="max-w-md mx-auto">
            <h4 className="text-base sm:text-lg font-bold text-gray-900">
              {filter === "ALL"
                ? "No salons referred yet"
                : `No salons found with status: ${filter}`}
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
              Tell salon owners to register on LockMyTime and enter your referral number:{" "}
              <span className="font-bold text-blue-600 font-mono">+{userPhone}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReferralsList;
