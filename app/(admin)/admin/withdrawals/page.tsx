import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import dbConnect from "@/server/db/mongodb";
import WithdrawalRequestModel from "@/server/models/WithdrawalRequest";
import ReferralProfileModel from "@/server/models/ReferralProfile";
import UserModel from "@/server/models/User";
import WithdrawalManagement, { AdminWithdrawalItem } from "@/components/Admin/WithdrawalManagement";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Withdrawal Management | LockMyTime Admin",
  description: "Admin portal to review pending UPI withdrawals and fulfill payouts.",
};

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const AdminWithdrawalsPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (!token) {
    redirect("/admin");
  }

  try {
    jwt.verify(token.value, JWT_SECRET);
  } catch (err) {
    redirect("/admin");
  }

  await dbConnect();

  const [rawRequests, pendingAgg, paidAgg] = await Promise.all([
    WithdrawalRequestModel.find({}).sort({ requestedAt: -1 }).limit(100).lean(),
    WithdrawalRequestModel.aggregate([
      { $match: { status: "PENDING" } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]),
    WithdrawalRequestModel.aggregate([
      { $match: { status: "PAID" } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]),
  ]);

  const withdrawals: AdminWithdrawalItem[] = await Promise.all(
    rawRequests.map(async (reqItem: any) => {
      const [user, profile] = await Promise.all([
        UserModel.findById(reqItem.userId).select("name email phone image").lean(),
        ReferralProfileModel.findById(reqItem.referralProfileId)
          .select("phone availableBalance totalEarned withdrawnAmount")
          .lean(),
      ]);

      return {
        id: reqItem._id.toString(),
        amount: reqItem.amount,
        payoutMethod: reqItem.payoutMethod,
        payoutAddress: reqItem.payoutAddress,
        status: reqItem.status,
        paymentReference: reqItem.paymentReference,
        adminNote: reqItem.adminNote,
        requestedAt: reqItem.requestedAt.toISOString(),
        paidAt: reqItem.paidAt ? reqItem.paidAt.toISOString() : undefined,
        rejectedAt: reqItem.rejectedAt ? reqItem.rejectedAt.toISOString() : undefined,
        referrer: user
          ? {
              id: (user as any)._id.toString(),
              name: (user as any).name,
              email: (user as any).email,
              phone: (user as any).phone,
            }
          : null,
        profile: profile
          ? {
              phone: (profile as any).phone,
              availableBalance: (profile as any).availableBalance,
              totalEarned: (profile as any).totalEarned,
              withdrawnAmount: (profile as any).withdrawnAmount,
            }
          : null,
      };
    })
  );

  const metricsData = {
    pendingCount: pendingAgg[0]?.count || 0,
    pendingAmount: pendingAgg[0]?.total || 0,
    paidCount: paidAgg[0]?.count || 0,
    paidAmount: paidAgg[0]?.total || 0,
  };

  return (
    <WithdrawalManagement
      initialWithdrawals={withdrawals}
      initialMetrics={metricsData}
    />
  );
};

export default AdminWithdrawalsPage;
