"use client";

import React, { useState } from "react";
import { toast } from "@/lib/toast";

export interface AdminWithdrawalItem {
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
  referrer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  } | null;
  profile?: {
    phone: string;
    availableBalance: number;
    totalEarned: number;
    withdrawnAmount: number;
  } | null;
}

interface WithdrawalManagementProps {
  initialWithdrawals: AdminWithdrawalItem[];
  initialMetrics: {
    pendingCount: number;
    pendingAmount: number;
    paidCount: number;
    paidAmount: number;
  };
}

const WithdrawalManagement: React.FC<WithdrawalManagementProps> = ({
  initialWithdrawals,
  initialMetrics,
}) => {
  const [withdrawals, setWithdrawals] = useState<AdminWithdrawalItem[]>(initialWithdrawals);
  const [metrics, setMetrics] = useState(initialMetrics);
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");
  const [selectedItem, setSelectedItem] = useState<AdminWithdrawalItem | null>(null);
  const [actionType, setActionType] = useState<"PAY" | "REJECT" | null>(null);
  const [paymentReference, setPaymentReference] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filteredList = withdrawals.filter((item) => {
    if (statusFilter === "ALL") return true;
    return item.status === statusFilter;
  });

  const openActionModal = (item: AdminWithdrawalItem, type: "PAY" | "REJECT") => {
    setSelectedItem(item);
    setActionType(type);
    setPaymentReference("");
    setAdminNote("");
  };

  const closeActionModal = () => {
    setSelectedItem(null);
    setActionType(null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleProcessAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !actionType) return;

    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/referrals/withdrawals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          withdrawalId: selectedItem.id,
          action: actionType,
          paymentReference: paymentReference.trim(),
          adminNote: adminNote.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to process withdrawal.");
      }

      toast.success(data.message || `Withdrawal marked as ${actionType === "PAY" ? "PAID" : "REJECTED"}!`);

      // Update local state
      setWithdrawals((prev) =>
        prev.map((w) =>
          w.id === selectedItem.id
            ? {
                ...w,
                status: actionType === "PAY" ? "PAID" : "REJECTED",
                paymentReference: paymentReference.trim(),
                adminNote: adminNote.trim(),
                paidAt: actionType === "PAY" ? new Date().toISOString() : undefined,
                rejectedAt: actionType === "REJECT" ? new Date().toISOString() : undefined,
              }
            : w
        )
      );

      closeActionModal();
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message || "Error processing request.");
    } finally {
      setSubmitting(false);
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
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 rounded-3xl text-white shadow-md">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md mb-2 text-indigo-200">
            <span>🏦</span> Admin UPI Payout Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Withdrawals & Payout Management
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-xl">
            Review pending user withdrawal requests, copy UPI destination addresses, pay via your UPI app, and mark as Paid.
          </p>
        </div>

        {metrics.pendingCount > 0 && (
          <div className="bg-amber-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 self-start sm:self-auto shadow-sm">
            <span>⚡</span>
            <span>{metrics.pendingCount} Pending Requests (₹{metrics.pendingAmount})</span>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs border-b-2 border-b-amber-500">
          <p className="text-xs font-semibold text-gray-500">Pending Payouts</p>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-600 mt-1">
            ₹{metrics.pendingAmount}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">{metrics.pendingCount} requests waiting</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs border-b-2 border-b-emerald-500">
          <p className="text-xs font-semibold text-gray-500">Total Paid Out</p>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-1">
            ₹{metrics.paidAmount}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">{metrics.paidCount} payouts fulfilled</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs border-b-2 border-b-blue-500">
          <p className="text-xs font-semibold text-gray-500">Average Payout</p>
          <p className="text-xl sm:text-2xl font-extrabold text-blue-600 mt-1">
            ₹{metrics.paidCount > 0 ? Math.round(metrics.paidAmount / metrics.paidCount) : 0}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">Per fulfilled withdrawal</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs border-b-2 border-b-indigo-500">
          <p className="text-xs font-semibold text-gray-500">Total Requests</p>
          <p className="text-xl sm:text-2xl font-extrabold text-indigo-600 mt-1">
            {withdrawals.length}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">All time submitted</p>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            Payout Requests ({filteredList.length})
          </h2>
          <p className="text-xs text-gray-500">
            Process manual UPI transfers and record payment reference UTRs
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
          {["PENDING", "PAID", "REJECTED", "ALL"].map((st) => (
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
              {st === "PENDING"
                ? `Pending (${metrics.pendingCount})`
                : st === "PAID"
                ? `Paid (${metrics.paidCount})`
                : st}
            </button>
          ))}
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-x-auto">
        {filteredList.length > 0 ? (
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-slate-50 border-b border-gray-100 font-bold text-gray-900 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Referrer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">UPI Destination</th>
                <th className="p-4">Requested On</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-900 text-sm">{item.referrer?.name || "Member"}</p>
                    <p className="text-[11px] text-gray-500">{item.referrer?.email}</p>
                    <p className="text-[11px] text-blue-600 font-mono font-semibold">{item.referrer?.phone}</p>
                  </td>

                  <td className="p-4">
                    <p className="text-base font-black text-gray-900">₹{item.amount}</p>
                    {item.profile && (
                      <p className="text-[10px] text-gray-400">Bal: ₹{item.profile.availableBalance}</p>
                    )}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs bg-slate-100 px-2 py-1 rounded-md text-gray-800">
                        {item.payoutAddress}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.payoutAddress)}
                        title="Copy UPI address"
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        📋
                      </button>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">
                      Via {item.payoutMethod === "UPI_ID" ? "UPI ID (VPA)" : "UPI Phone"}
                    </span>
                  </td>

                  <td className="p-4 text-[11px] text-gray-400">
                    <p>{formatDate(item.requestedAt)}</p>
                    {item.paymentReference && (
                      <p className="text-emerald-700 font-mono text-[10px] mt-0.5">
                        Ref: {item.paymentReference}
                      </p>
                    )}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === "PAID"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : item.status === "PENDING"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    {item.status === "PENDING" ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openActionModal(item, "PAY")}
                          className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer"
                        >
                          Mark as Paid
                        </button>
                        <button
                          type="button"
                          onClick={() => openActionModal(item, "REJECT")}
                          className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-gray-700 font-bold text-xs transition-all cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-gray-400 italic">
                        {item.status === "PAID" ? "Completed" : "Declined"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center space-y-2">
            <p className="text-sm font-bold text-gray-900">No requests found</p>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              There are currently no withdrawal requests under the {statusFilter} filter.
            </p>
          </div>
        )}
      </div>

      {/* Action Modal (Pay or Reject) */}
      {selectedItem && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    actionType === "PAY"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {actionType === "PAY" ? "Fulfill UPI Payout" : "Reject Withdrawal Request"}
                </span>
                <h3 className="text-lg font-extrabold text-gray-900 mt-1">
                  {actionType === "PAY"
                    ? `Confirm ₹${selectedItem.amount} Payout`
                    : `Reject ₹${selectedItem.amount} Request`}
                </h3>
              </div>

              <button
                type="button"
                onClick={closeActionModal}
                className="text-gray-400 hover:text-gray-600 p-1 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Payout Details Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Recipient:</span>
                <span className="font-bold text-gray-900">{selectedItem.referrer?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Destination:</span>
                <span className="font-mono font-bold text-blue-600 flex items-center gap-1">
                  {selectedItem.payoutAddress}
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedItem.payoutAddress)}
                    className="cursor-pointer"
                  >
                    📋
                  </button>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="font-black text-sm text-emerald-600">₹{selectedItem.amount}</span>
              </div>
            </div>

            <form onSubmit={handleProcessAction} className="space-y-4">
              {actionType === "PAY" ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    UPI Reference / UTR Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 423456789012 or GPay-Ref"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-mono focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Enter the transaction UTR number from your UPI app for user reference.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Reason for Rejection *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. Invalid UPI ID or duplicate submission"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all"
                  />
                  <p className="text-[11px] text-amber-600 mt-1">
                    Rejecting will immediately refund ₹{selectedItem.amount} back to the user&apos;s available balance.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeActionModal}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50 ${
                    actionType === "PAY"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {submitting
                    ? "Processing..."
                    : actionType === "PAY"
                    ? "Confirm Payment Done"
                    : "Confirm Rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalManagement;
