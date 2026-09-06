import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/server/middleware/auth";
import dbConnect from "@/server/db/mongodb";
import ReferralProfileModel from "@/server/models/ReferralProfile";
import WithdrawalRequestModel from "@/server/models/WithdrawalRequest";
import { recalculateProfileBalances, getOrCreateReferralSettings } from "@/server/services/referralService";
import WithdrawForm from "@/components/Referral/WithdrawForm";
import PayoutSettings from "@/components/Referral/PayoutSettings";
import WithdrawalHistoryTable, { WithdrawalRecord } from "@/components/Referral/WithdrawalHistoryTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Withdraw Earnings | LockMyTime Refer & Earn",
  description: "Request withdrawals of your available referral earnings to UPI.",
};

const WithdrawPage = async () => {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  await dbConnect();

  const profile = await ReferralProfileModel.findOne({ userId: user._id }).lean();

  if (!profile) {
    redirect("/refer/setup");
  }

  const [balances, settings, rawWithdrawals] = await Promise.all([
    recalculateProfileBalances(profile._id),
    getOrCreateReferralSettings(),
    WithdrawalRequestModel.find({ referralProfileId: profile._id })
      .sort({ requestedAt: -1 })
      .lean(),
  ]);

  const withdrawals: WithdrawalRecord[] = rawWithdrawals.map((item: any) => ({
    id: item._id.toString(),
    amount: item.amount,
    payoutMethod: item.payoutMethod,
    payoutAddress: item.payoutAddress,
    status: item.status,
    paymentReference: item.paymentReference,
    adminNote: item.adminNote,
    requestedAt: item.requestedAt.toISOString(),
    paidAt: item.paidAt ? item.paidAt.toISOString() : undefined,
    rejectedAt: item.rejectedAt ? item.rejectedAt.toISOString() : undefined,
  }));

  return (
    <div className="py-6 sm:py-10 max-w-5xl mx-auto space-y-6">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Link href="/refer/dashboard" className="hover:text-blue-600 transition-colors">
              Referral Dashboard
            </Link>
            <span>/</span>
            <span className="font-semibold text-gray-900">Withdraw</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Withdraw Referral Earnings
          </h1>
        </div>

        <Link
          href="/refer/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Main Forms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <WithdrawForm
            availableBalance={balances.availableBalance}
            minWithdrawal={settings.minWithdrawalAmount || 100}
            savedPayoutMethod={profile.payoutMethod || "UPI_ID"}
            savedUpiId={profile.upiId || ""}
            savedUpiPhone={profile.upiPhone || profile.phone}
          />
        </div>

        <div className="lg:col-span-5">
          <PayoutSettings
            initialMethod={profile.payoutMethod || "UPI_ID"}
            initialUpiId={profile.upiId || ""}
            initialUpiPhone={profile.upiPhone || profile.phone}
          />
        </div>
      </div>

      {/* History Table */}
      <WithdrawalHistoryTable withdrawals={withdrawals} />
    </div>
  );
};

export default WithdrawPage;
