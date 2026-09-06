import React from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/server/middleware/auth";
import dbConnect from "@/server/db/mongodb";
import ReferralProfileModel from "@/server/models/ReferralProfile";
import ReferralModel from "@/server/models/Referral";
import ShopModel from "@/server/models/Shop";
import { recalculateProfileBalances } from "@/server/services/referralService";
import ReferralDashboard from "@/components/Referral/ReferralDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Referral Dashboard | LockMyTime",
  description: "View your referral earnings, referred salons, and withdrawal status.",
};

const ReferralDashboardPage = async () => {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  await dbConnect();

  const profile = await ReferralProfileModel.findOne({ userId: user._id }).lean();

  if (!profile) {
    redirect("/refer/setup");
  }

  // Live balance recalculation for accuracy
  const freshBalances = await recalculateProfileBalances(profile._id);

  // Fetch referred salons
  const rawReferrals = await ReferralModel.find({
    referrerProfileId: profile._id,
  })
    .sort({ createdAt: -1 })
    .lean();

  const referrals = await Promise.all(
    rawReferrals.map(async (ref: any) => {
      const shop = await ShopModel.findById(ref.referredShopId)
        .select("name ownerName phone email image address available")
        .lean();

      const initialRewardEarned =
        ref.initialRewardStatus === "CREDITED" ? ref.initialRewardAmount : 0;
      const totalEarnedFromSalon =
        initialRewardEarned + (ref.totalCommissionEarned || 0);

      return {
        id: ref._id.toString(),
        referredShopId: ref.referredShopId.toString(),
        referrerPhone: ref.referrerPhone,
        shopPhone: ref.shopPhone,
        status: ref.status,
        initialRewardAmount: ref.initialRewardAmount,
        initialRewardStatus: ref.initialRewardStatus,
        totalBookingsCompleted: ref.totalBookingsCompleted || 0,
        totalCommissionEarned: ref.totalCommissionEarned || 0,
        totalEarnedFromSalon,
        verifiedAt: ref.verifiedAt ? ref.verifiedAt.toISOString() : undefined,
        createdAt: ref.createdAt.toISOString(),
        shop: shop
          ? {
              id: (shop as any)._id.toString(),
              name: (shop as any).name,
              ownerName: (shop as any).ownerName,
              phone: (shop as any).phone,
              email: (shop as any).email,
              image: (shop as any).image,
              address: (shop as any).address,
              available: (shop as any).available,
            }
          : null,
      };
    })
  );

  const profileData = {
    phone: profile.phone,
    totalEarned: freshBalances.totalEarned,
    availableBalance: freshBalances.availableBalance,
    pendingBalance: freshBalances.pendingBalance,
    withdrawnAmount: freshBalances.withdrawnAmount,
    payoutMethod: profile.payoutMethod,
    upiId: profile.upiId,
    upiPhone: profile.upiPhone,
  };

  return (
    <ReferralDashboard
      user={{
        id: user._id,
        name: user.name,
        email: user.email,
      }}
      profile={profileData}
      referrals={referrals}
    />
  );
};

export default ReferralDashboardPage;
