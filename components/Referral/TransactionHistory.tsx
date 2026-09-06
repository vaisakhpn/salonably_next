"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { TransactionRowSkeleton } from "./ReferralSkeleton";

export interface TransactionItem {
  id: string;
  type: "REFERRAL_BONUS" | "BOOKING_COMMISSION" | "WITHDRAWAL" | "REVERSAL" | "ADJUSTMENT";
  amount: number;
  status: string;
  description: string;
  shopName?: string;
  bookingId?: string;
  withdrawalId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

interface TransactionHistoryProps {
  initialTransactions?: TransactionItem[];
  initialPagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  initialTransactions = [],
  initialPagination = { total: 0, page: 1, limit: 20, totalPages: 1 },
}) => {
  const [transactions, setTransactions] = useState<TransactionItem[]>(initialTransactions);
  const [pagination, setPagination] = useState(initialPagination);
  const [filterType, setFilterType] = useState<string>("ALL");
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async (page: number, type: string) => {
    setLoading(true);
    try {
      const typeQuery = type !== "ALL" ? `&type=${type}` : "";
      const res = await fetch(`/api/referral/transactions?page=${page}&limit=20${typeQuery}`);
      const data = await res.json();
      if (res.ok && data.transactions) {
        setTransactions(data.transactions);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilterChange = (newType: string) => {
    setFilterType(newType);
    fetchTransactions(1, newType);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchTransactions(newPage, filterType);
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "REFERRAL_BONUS":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span>🎁</span>
            <span>Referral Bonus</span>
          </span>
        );
      case "BOOKING_COMMISSION":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span>✂️</span>
            <span>Booking Commission</span>
          </span>
        );
      case "WITHDRAWAL":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <span>🏦</span>
            <span>Withdrawal Payout</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200">
            <span>⚙️</span>
            <span>Adjustment</span>
          </span>
        );
    }
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-4">
      {/* Header & Filter Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            Financial Ledger ({pagination.total} entries)
          </h2>
          <p className="text-xs text-gray-500">
            Complete statement of credited bonuses, booking commissions, and withdrawals
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => handleFilterChange("ALL")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              filterType === "ALL"
                ? "bg-white text-blue-600 font-bold shadow-2xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => handleFilterChange("REFERRAL_BONUS")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              filterType === "REFERRAL_BONUS"
                ? "bg-white text-emerald-600 font-bold shadow-2xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Bonus (₹100)
          </button>
          <button
            type="button"
            onClick={() => handleFilterChange("BOOKING_COMMISSION")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              filterType === "BOOKING_COMMISSION"
                ? "bg-white text-blue-600 font-bold shadow-2xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Commission (₹3–₹10)
          </button>
          <button
            type="button"
            onClick={() => handleFilterChange("WITHDRAWAL")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              filterType === "WITHDRAWAL"
                ? "bg-white text-purple-600 font-bold shadow-2xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Withdrawals
          </button>
        </div>
      </div>

      {/* Transactions Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-100">
            {[1, 2, 3, 4, 5].map((i) => (
              <TransactionRowSkeleton key={i} />
            ))}
          </div>
        ) : transactions.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {transactions.map((tx) => {
              const isDebit = tx.type === "WITHDRAWAL";

              return (
                <div
                  key={tx.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shrink-0 ${
                        tx.type === "REFERRAL_BONUS"
                          ? "bg-emerald-50 text-emerald-600"
                          : tx.type === "BOOKING_COMMISSION"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-purple-50 text-purple-600"
                      }`}
                    >
                      {tx.type === "REFERRAL_BONUS"
                        ? "🎁"
                        : tx.type === "BOOKING_COMMISSION"
                        ? "✂️"
                        : "🏦"}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getTypeBadge(tx.type)}
                        {tx.shopName && (
                          <span className="text-xs font-semibold text-gray-700 bg-slate-100 px-2 py-0.5 rounded-md">
                            {tx.shopName}
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm font-medium text-gray-900">
                        {tx.description}
                      </p>

                      <p className="text-[11px] text-gray-400">
                        {formatDateTime(tx.createdAt)}
                        {tx.bookingId ? ` • Booking Ref: #${tx.bookingId.slice(-6)}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0 pl-13 sm:pl-0">
                    <p
                      className={`text-base sm:text-lg font-black tracking-tight ${
                        isDebit ? "text-slate-800" : "text-emerald-600"
                      }`}
                    >
                      {isDebit ? `-₹${tx.amount}` : `+₹${tx.amount}`}
                    </p>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-xl">
              📜
            </div>
            <h4 className="text-base font-bold text-gray-900">No Transactions Found</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {filterType === "ALL"
                ? "Your earnings and withdrawal history will be logged here in real-time as your referred salons get verified and complete bookings."
                : `No transactions found under the ${filterType.toLowerCase().replace("_", " ")} filter.`}
            </p>
          </div>
        )}

        {/* Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="p-4 bg-slate-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span>
              Page <span className="font-bold text-gray-900">{pagination.page}</span> of{" "}
              <span className="font-bold text-gray-900">{pagination.totalPages}</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1 || loading}
                className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 font-semibold disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages || loading}
                className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 font-semibold disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
