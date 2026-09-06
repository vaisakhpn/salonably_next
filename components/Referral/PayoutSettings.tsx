"use client";

import React, { useState } from "react";
import { toast } from "@/lib/toast";

interface PayoutSettingsProps {
  initialMethod?: "UPI_ID" | "UPI_PHONE";
  initialUpiId?: string;
  initialUpiPhone?: string;
  onSettingsSaved?: (settings: { payoutMethod: string; upiId: string; upiPhone: string }) => void;
}

const PayoutSettings: React.FC<PayoutSettingsProps> = ({
  initialMethod = "UPI_ID",
  initialUpiId = "",
  initialUpiPhone = "",
  onSettingsSaved,
}) => {
  const [payoutMethod, setPayoutMethod] = useState<"UPI_ID" | "UPI_PHONE">(initialMethod);
  const [upiId, setUpiId] = useState(initialUpiId);
  const [upiPhone, setUpiPhone] = useState(initialUpiPhone);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/referral/payout-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payoutMethod,
          upiId: upiId.trim(),
          upiPhone: upiPhone.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update payout settings.");
      }

      toast.success(data.message || "Payout settings saved!");
      if (onSettingsSaved) {
        onSettingsSaved({
          payoutMethod,
          upiId: upiId.trim(),
          upiPhone: upiPhone.trim(),
        });
      }
    } catch (err: any) {
      toast.error(err.message || "Error saving payout settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
      <div>
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <span>⚙️</span>
          <span>Payout Preferences</span>
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Choose where admin should send your referral earnings via UPI
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Method Toggle */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setPayoutMethod("UPI_ID")}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              payoutMethod === "UPI_ID"
                ? "bg-white text-blue-600 shadow-2xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            UPI ID (VPA)
          </button>
          <button
            type="button"
            onClick={() => setPayoutMethod("UPI_PHONE")}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              payoutMethod === "UPI_PHONE"
                ? "bg-white text-blue-600 shadow-2xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            UPI-linked Phone
          </button>
        </div>

        {payoutMethod === "UPI_ID" ? (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              Your UPI ID *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. name@okhdfcbank or user@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all font-mono"
            />
          </div>
        ) : (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
              UPI Mobile Number *
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs font-bold text-gray-400 select-none">
                +91
              </span>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="9876543210"
                value={upiPhone}
                onChange={(e) => setUpiPhone(e.target.value.replace(/\D/g, ""))}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all tracking-wider"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-60"
        >
          {loading ? "Saving Settings..." : "Save Payout Preferences"}
        </button>
      </form>
    </div>
  );
};

export default PayoutSettings;
