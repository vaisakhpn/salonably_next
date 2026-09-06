import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/server/middleware/auth";
import dbConnect from "@/server/db/mongodb";
import ReferralProfileModel from "@/server/models/ReferralProfile";
import ReferralTransactionModel from "@/server/models/ReferralTransaction";
import ShopModel from "@/server/models/Shop";
import { recalculateProfileBalances } from "@/server/services/referralService";
import TransactionHistory, { TransactionItem } from "@/components/Referral/TransactionHistory";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Earnings & Ledger | LockMyTime Refer & Earn",
  description: "View your complete referral rewards, booking commissions, and withdrawal statements.",
};

const EarningsPage = async () => {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  await dbConnect();

  const profile = await ReferralProfileModel.findOne({ userId: user._id }).lean();

  if (!profile) {
    redirect("/refer/setup");
  }

  const balances = await recalculateProfileBalances(profile._id);

  // Fetch initial 20 transactions
  const totalCount = await ReferralTransactionModel.countDocuments({
    referralProfileId: profile._id,
  });

  const rawTransactions = await ReferralTransactionModel.find({
    referralProfileId: profile._id,
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  const initialTransactions: TransactionItem[] = await Promise.all(
    rawTransactions.map(async (tx: any) => {
      let shopName = "";
      if (tx.shopId) {
        const shop = await ShopModel.findById(tx.shopId).select("name").lean();
        if (shop) shopName = (shop as any).name;
      }

      return {
        id: tx._id.toString(),
        type: tx.type,
        amount: tx.amount,
        status: tx.status,
        description: tx.description,
        shopName,
        bookingId: tx.bookingId ? tx.bookingId.toString() : undefined,
        withdrawalId: tx.withdrawalId ? tx.withdrawalId.toString() : undefined,
        metadata: tx.metadata,
        createdAt: tx.createdAt.toISOString(),
      };
    })
  );

  const initialPagination = {
    total: totalCount,
    page: 1,
    limit: 20,
    totalPages: Math.ceil(totalCount / 20) || 1,
  };

  return (
    <div className="py-6 sm:py-10 max-w-5xl mx-auto space-y-6">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Link href="/refer/dashboard" className="hover:text-blue-600 transition-colors">
              Referral Dashboard
            </Link>
            <span>/</span>
            <span className="font-semibold text-gray-900">Earnings & Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Earnings & Ledger Statement
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

      {/* Mini Balance Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-md">
        <div>
          <p className="text-[11px] text-indigo-300 font-medium">Total Earned</p>
          <p className="text-xl sm:text-2xl font-black text-white mt-0.5">₹{balances.totalEarned}</p>
        </div>
        <div>
          <p className="text-[11px] text-indigo-300 font-medium">Pending</p>
          <p className="text-xl sm:text-2xl font-black text-amber-400 mt-0.5">₹{balances.pendingBalance}</p>
        </div>
        <div>
          <p className="text-[11px] text-indigo-300 font-medium">Available</p>
          <p className="text-xl sm:text-2xl font-black text-emerald-400 mt-0.5">₹{balances.availableBalance}</p>
        </div>
        <div>
          <p className="text-[11px] text-indigo-300 font-medium">Withdrawn</p>
          <p className="text-xl sm:text-2xl font-black text-purple-300 mt-0.5">₹{balances.withdrawnAmount}</p>
        </div>
      </div>

      {/* Transaction History Component */}
      <TransactionHistory
        initialTransactions={initialTransactions}
        initialPagination={initialPagination}
      />
    </div>
  );
};

export default EarningsPage;
