"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import lockmytime from "@/assets/LockMyTime.png";
import { toast } from "@/lib/toast";

interface ReferralSetupProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

const ReferralSetup: React.FC<ReferralSetupProps> = ({ user }) => {
  const router = useRouter();
  const [phone, setPhone] = useState(user.phone || "");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/referral/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: cleanPhone,
          upiId: upiId.trim(),
          payoutMethod: upiId.trim() ? "UPI_ID" : "UPI_PHONE",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create referral profile.");
      }

      toast.success(data.message || "Referral profile activated successfully!");
      router.push("/refer/dashboard");
      router.refresh();
    } catch (err: any) {
      const msg = err.message || "An unexpected error occurred.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl shadow-blue-950/5 border border-gray-100 overflow-hidden">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6 sm:p-8 text-white relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3.5 mb-4">
            <Image
              src={lockmytime}
              alt="LockMyTime"
              className="w-12 h-12 rounded-full border-2 border-white/80 object-cover shadow-sm"
            />
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-blue-200">
                LockMyTime Partner Program
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Refer & Earn
              </h1>
            </div>
          </div>

          <p className="relative z-10 text-xs sm:text-sm text-blue-100 leading-relaxed max-w-md">
            Refer salon, beauty parlour, or spa owners to LockMyTime and build an ongoing revenue stream!
          </p>
        </div>

        {/* Benefits Section */}
        <div className="p-6 sm:p-8 bg-slate-50/50 border-b border-gray-100">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3.5">
            How You Earn
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-gray-200/70 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
                ₹100
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">One-Time Bonus</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Credited as soon as the referred salon is verified by admin.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-gray-200/70 shadow-2xs">
              <div className="w-auto px-2 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 whitespace-nowrap">
                ₹3 – ₹10
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Per Completed Booking</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Ongoing lifetime commission (approx. ₹500 – ₹2,000/mo) for every finished appointment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-6 sm:p-8">
          <div className="mb-5">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Activate Your Referral Number
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Salon owners will use this phone number during registration to link the salon to you.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Referral Phone Number *
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-xs font-bold text-gray-400 select-none">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all tracking-wider"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Make sure this is your active number. It will be your primary referral code.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                UPI ID for Payouts (Optional)
              </label>
              <input
                type="text"
                placeholder="yourname@upi (or can be added later)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || phone.length < 10}
              className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Activating Profile...</span>
                </>
              ) : (
                <span>Start Referring & Earning</span>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            By continuing, you agree to LockMyTime&apos;s Referral Terms & Conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReferralSetup;
