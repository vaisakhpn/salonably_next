"use client";

import React, { useState } from "react";
import { toast } from "@/lib/toast";

interface WithdrawFormProps {
  availableBalance: number;
  minWithdrawal?: number;
  savedPayoutMethod?: "UPI_ID" | "UPI_PHONE";
  savedUpiId?: string;
  savedUpiPhone?: string;
  onWithdrawalCreated?: () => void;
}

const WithdrawForm: React.FC<WithdrawFormProps> = ({
  availableBalance,
  minWithdrawal = 100,
  savedPayoutMethod = "UPI_ID",
  savedUpiId = "",
  savedUpiPhone = "",
  onWithdrawalCreated,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [payoutMethod, setPayoutMethod] = useState<"UPI_ID" | "UPI_PHONE">(savedPayoutMethod);
  const [payoutAddress, setPayoutAddress] = useState<string>(
    savedPayoutMethod === "UPI_ID" ? savedUpiId : savedUpiPhone
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleQuickAmount = (val: number) => {
    if (val <= availableBalance) {
      setAmount(val.toString());
      setError("");
    } else {
      setAmount(availableBalance.toString());
      setError("");
    }
  };

  const handleMethodChange = (newMethod: "UPI_ID" | "UPI_PHONE") => {
    setPayoutMethod(newMethod);
    setPayoutAddress(newMethod === "UPI_ID" ? savedUpiId : savedUpiPhone);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const numAmount = Number(amount);

    if (isNaN(numAmount) || numAmount < minWithdrawal) {
      setError(`Minimum withdrawal amount is ₹${minWithdrawal}.`);
      return;
    }

    if (numAmount > availableBalance) {
      setError(`Amount exceeds your available balance of ₹${availableBalance}.`);
      return;
    }

    if (!payoutAddress.trim()) {
      setError("Please provide a valid payout address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/referral/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numAmount,
          payoutMethod,
          payoutAddress: payoutAddress.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit withdrawal request.");
      }

      toast.success(data.message || "Withdrawal request submitted successfully!");
      setAmount("");
      if (onWithdrawalCreated) {
        onWithdrawalCreated();
      }
    } catch (err: any) {
      const msg = err.message || "An unexpected error occurred.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const canWithdraw = availableBalance >= minWithdrawal;

  return (
    <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            Instant Payout Desk
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-1">
            Request UPI Withdrawal
          </h2>
        </div>

        <div className="text-right">
          <p className="text-[11px] text-gray-500 font-medium">Available Balance</p>
          <p className="text-xl sm:text-2xl font-black text-emerald-600">
            ₹{availableBalance}
          </p>
        </div>
      </div>

      {!canWithdraw && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <span>ℹ️</span>
          <span>
            You need a minimum balance of <span className="font-bold">₹{minWithdrawal}</span> to request a withdrawal. Current available balance: <span className="font-bold">₹{availableBalance}</span>.
          </span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-medium">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Payout Method Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
            Transfer Destination
          </label>
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => handleMethodChange("UPI_ID")}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                payoutMethod === "UPI_ID"
                  ? "bg-white text-blue-600 shadow-2xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              UPI ID (e.g. name@upi)
            </button>
            <button
              type="button"
              onClick={() => handleMethodChange("UPI_PHONE")}
              className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                payoutMethod === "UPI_PHONE"
                  ? "bg-white text-blue-600 shadow-2xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              UPI Mobile Number
            </button>
          </div>
        </div>

        {/* Payout Address Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
            {payoutMethod === "UPI_ID" ? "Enter UPI ID *" : "Enter 10-Digit UPI Phone *"}
          </label>
          <input
            type="text"
            required
            placeholder={
              payoutMethod === "UPI_ID"
                ? "e.g. yourname@okhdfcbank"
                : "e.g. 9876543210"
            }
            value={payoutAddress}
            onChange={(e) => setPayoutAddress(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all font-mono"
          />
        </div>

        {/* Withdrawal Amount Input */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              Withdrawal Amount (₹) *
            </label>
            <span className="text-[11px] text-gray-400 font-medium">
              Min ₹{minWithdrawal}
            </span>
          </div>

          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-base font-bold text-gray-400 select-none">
              ₹
            </span>
            <input
              type="number"
              required
              min={minWithdrawal}
              max={availableBalance}
              placeholder={`Min ${minWithdrawal}`}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError("");
              }}
              className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-base font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all"
            />
          </div>

          {/* Quick Amount Chips */}
          {canWithdraw && (
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto text-xs">
              <span className="text-[11px] text-gray-400 mr-1">Quick:</span>
              {[100, 200, 500].map((quickVal) => {
                if (quickVal <= availableBalance) {
                  return (
                    <button
                      key={quickVal}
                      type="button"
                      onClick={() => handleQuickAmount(quickVal)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 font-bold text-gray-700 transition-colors cursor-pointer"
                    >
                      ₹{quickVal}
                    </button>
                  );
                }
                return null;
              })}
              <button
                type="button"
                onClick={() => handleQuickAmount(availableBalance)}
                className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 font-bold hover:bg-blue-100 transition-colors cursor-pointer"
              >
                Max All (₹{availableBalance})
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !canWithdraw || !amount || Number(amount) < minWithdrawal || Number(amount) > availableBalance}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Submitting Request...</span>
            </>
          ) : (
            <span>Submit Withdrawal Request</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default WithdrawForm;
