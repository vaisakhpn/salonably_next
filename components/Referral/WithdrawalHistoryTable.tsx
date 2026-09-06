"use client";

import React from "react";

export interface WithdrawalRecord {
  id: string;
  amount: number;
  payoutMethod: "UPI_ID" | "UPI_PHONE";
  payoutAddress: string;
  status: "PENDING" | "PAID" | "REJECTED";
  paymentReference?: string;
  adminNote?: string;
  requestedAt: string;
  paidAt?: string;
  rejectedAt?: string;
}

interface WithdrawalHistoryTableProps {
  withdrawals: WithdrawalRecord[];
}

const WithdrawalHistoryTable: React.FC<WithdrawalHistoryTableProps> = ({ withdrawals }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Paid
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Processing
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
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            Withdrawal Requests ({withdrawals.length})
          </h3>
          <p className="text-xs text-gray-500">
            History of requested, processed, and paid UPI withdrawals
          </p>
        </div>
      </div>

      {withdrawals.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {withdrawals.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shrink-0 ${
                    item.status === "PAID"
                      ? "bg-emerald-50 text-emerald-600"
                      : item.status === "REJECTED"
                      ? "bg-red-50 text-red-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {item.status === "PAID" ? "✓" : item.status === "REJECTED" ? "✕" : "⏳"}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-gray-900">
                      ₹{item.amount}
                    </p>
                    {getStatusBadge(item.status)}
                  </div>

                  <p className="text-xs text-gray-600">
                    To: <span className="font-semibold text-gray-800 font-mono">{item.payoutAddress}</span> ({item.payoutMethod === "UPI_ID" ? "UPI ID" : "Phone"})
                  </p>

                  <p className="text-[11px] text-gray-400">
                    Requested: {formatDate(item.requestedAt)}
                    {item.paidAt && ` • Paid: ${formatDate(item.paidAt)}`}
                  </p>

                  {item.paymentReference && (
                    <p className="text-xs text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-100 inline-block font-mono">
                      Ref/UTR: {item.paymentReference}
                    </p>
                  )}

                  {item.adminNote && (
                    <p className="text-xs text-gray-500 italic">
                      Note: {item.adminNote}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <p className="text-sm font-bold text-gray-900">
                  ₹{item.amount}
                </p>
                <p className="text-[11px] text-gray-400">
                  {item.status === "PAID" ? "Credited to UPI" : item.status === "REJECTED" ? "Refunded to balance" : "Admin review in progress"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center space-y-2">
          <p className="text-sm font-bold text-gray-900">No withdrawal requests yet</p>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Once your available balance reaches at least ₹100, submit a request above to withdraw your earnings.
          </p>
        </div>
      )}
    </div>
  );
};

export default WithdrawalHistoryTable;
