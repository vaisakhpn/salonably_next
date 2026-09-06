import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import dbConnect from "@/server/db/mongodb";
import ReferralProfileModel from "@/server/models/ReferralProfile";
import ReferralModel from "@/server/models/Referral";
import ReferralTransactionModel from "@/server/models/ReferralTransaction";
import WithdrawalRequestModel from "@/server/models/WithdrawalRequest";
import ShopModel from "@/server/models/Shop";
import UserModel from "@/server/models/User";
import { getOrCreateReferralSettings } from "@/server/services/referralService";
import ReferralManagement from "@/components/Admin/ReferralManagement";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Referral Management | LockMyTime Admin",
  description: "Admin portal to verify referred salons, track earnings, and configure referral rates.",
};

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const AdminReferralsPage = async () => {
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

  const [
    totalReferrers,
    totalReferredSalons,
    pendingVerificationCount,
    activeReferralsCount,
    rejectedReferralsCount,
    rewardsAgg,
    commissionsAgg,
    pendingWithdrawalsAgg,
    paidWithdrawalsAgg,
    settings,
    rawPending,
    rawAllReferrals,
  ] = await Promise.all([
    ReferralProfileModel.countDocuments({ status: "active" }),
    ReferralModel.countDocuments(),
    ReferralModel.countDocuments({ status: "PENDING_VERIFICATION" }),
    ReferralModel.countDocuments({ status: "ACTIVE" }),
    ReferralModel.countDocuments({ status: "REJECTED" }),
    ReferralTransactionModel.aggregate([
      { $match: { type: "REFERRAL_BONUS", status: "COMPLETED" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    ReferralTransactionModel.aggregate([
      { $match: { type: "BOOKING_COMMISSION", status: "COMPLETED" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    WithdrawalRequestModel.aggregate([
      { $match: { status: "PENDING" } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]),
    WithdrawalRequestModel.aggregate([
      { $match: { status: "PAID" } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]),
    getOrCreateReferralSettings(),
    ReferralModel.find({ status: "PENDING_VERIFICATION" }).sort({ createdAt: -1 }).lean(),
    ReferralModel.find({}).sort({ createdAt: -1 }).limit(100).lean(),
  ]);

  const totalRewardsPaid = rewardsAgg[0]?.total || 0;
  const totalCommissionsPaid = commissionsAgg[0]?.total || 0;
  const totalEarnedAcrossPlatform = totalRewardsPaid + totalCommissionsPaid;
  const pendingWithdrawalAmount = pendingWithdrawalsAgg[0]?.total || 0;
  const pendingWithdrawalCount = pendingWithdrawalsAgg[0]?.count || 0;
  const totalPaidOut = paidWithdrawalsAgg[0]?.total || 0;
  const totalPaidOutCount = paidWithdrawalsAgg[0]?.count || 0;
  const totalAvailableInProfiles = Math.max(0, totalEarnedAcrossPlatform - totalPaidOut - pendingWithdrawalAmount);

  // Enrich pending list
  const pendingList = await Promise.all(
    rawPending.map(async (ref: any) => {
      const [shop, user] = await Promise.all([
        ShopModel.findById(ref.referredShopId)
          .select("name ownerName email phone image address date")
          .lean(),
        UserModel.findById(ref.referrerUserId).select("name email image phone").lean(),
      ]);

      return {
        id: ref._id.toString(),
        referrerPhone: ref.referrerPhone,
        shopPhone: ref.shopPhone,
        status: ref.status,
        initialRewardAmount: ref.initialRewardAmount,
        initialRewardStatus: ref.initialRewardStatus,
        createdAt: ref.createdAt.toISOString(),
        shop: shop
          ? {
              id: (shop as any)._id.toString(),
              name: (shop as any).name,
              ownerName: (shop as any).ownerName,
              email: (shop as any).email,
              phone: (shop as any).phone,
              image: (shop as any).image,
              address: (shop as any).address,
              date: (shop as any).date,
            }
          : null,
        referrer: user
          ? {
              id: (user as any)._id.toString(),
              name: (user as any).name,
              email: (user as any).email,
              phone: (user as any).phone,
              image: (user as any).image,
            }
          : null,
      };
    })
  );

  // Enrich all referrals list
  const allReferrals = await Promise.all(
    rawAllReferrals.map(async (ref: any) => {
      const [shop, user, profile] = await Promise.all([
        ShopModel.findById(ref.referredShopId)
          .select("name ownerName email phone image address fees available")
          .lean(),
        UserModel.findById(ref.referrerUserId).select("name email phone image").lean(),
        ReferralProfileModel.findById(ref.referrerProfileId)
          .select("payoutMethod upiId upiPhone availableBalance totalEarned")
          .lean(),
      ]);

      return {
        id: ref._id.toString(),
        referrerPhone: ref.referrerPhone,
        shopPhone: ref.shopPhone,
        status: ref.status,
        initialRewardAmount: ref.initialRewardAmount,
        initialRewardStatus: ref.initialRewardStatus,
        totalBookingsCompleted: ref.totalBookingsCompleted || 0,
        totalCommissionEarned: ref.totalCommissionEarned || 0,
        totalEarnedFromSalon:
          (ref.initialRewardStatus === "CREDITED" ? ref.initialRewardAmount : 0) +
          (ref.totalCommissionEarned || 0),
        verifiedAt: ref.verifiedAt ? ref.verifiedAt.toISOString() : undefined,
        createdAt: ref.createdAt.toISOString(),
        shop: shop
          ? {
              id: (shop as any)._id.toString(),
              name: (shop as any).name,
              ownerName: (shop as any).ownerName,
              email: (shop as any).email,
              phone: (shop as any).phone,
              image: (shop as any).image,
              address: (shop as any).address,
              fees: (shop as any).fees,
              available: (shop as any).available,
            }
          : null,
        referrer: user
          ? {
              id: (user as any)._id.toString(),
              name: (user as any).name,
              email: (user as any).email,
              phone: (user as any).phone,
              image: (user as any).image,
            }
          : null,
        profile: profile
          ? {
              payoutMethod: (profile as any).payoutMethod,
              upiId: (profile as any).upiId,
              upiPhone: (profile as any).upiPhone,
              availableBalance: (profile as any).availableBalance,
            }
          : null,
      };
    })
  );

  const metricsData = {
    totalReferrers,
    totalReferredSalons,
    pendingVerificationCount,
    activeReferralsCount,
    rejectedReferralsCount,
    totalRewardsPaid,
    totalCommissionsPaid,
    totalEarnedAcrossPlatform,
    pendingWithdrawalAmount,
    pendingWithdrawalCount,
    totalPaidOut,
    totalPaidOutCount,
    totalAvailableInProfiles,
  };

  const settingsData = {
    initialRewardAmount: settings.initialRewardAmount,
    bookingCommissionAmount: settings.bookingCommissionAmount,
    minWithdrawalAmount: settings.minWithdrawalAmount,
    isProgramActive: settings.isProgramActive,
  };

  return (
    <ReferralManagement
      initialMetrics={metricsData}
      initialPending={pendingList}
      initialReferrals={allReferrals}
      initialSettings={settingsData}
    />
  );
};

export default AdminReferralsPage;
