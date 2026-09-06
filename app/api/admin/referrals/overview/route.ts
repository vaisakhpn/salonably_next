import { NextResponse } from "next/server";
import dbConnect from "@/server/db/mongodb";
import { isAdmin } from "@/server/middleware/auth";
import ReferralProfileModel from "@/server/models/ReferralProfile";
import ReferralModel from "@/server/models/Referral";
import ReferralTransactionModel from "@/server/models/ReferralTransaction";
import WithdrawalRequestModel from "@/server/models/WithdrawalRequest";

/**
 * GET /api/admin/referrals/overview
 * Returns comprehensive system-wide metrics for the admin referral dashboard.
 */
export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Unauthorized. Admin access required." }, { status: 401 });
    }

    await dbConnect();

    const [
      totalReferrers,
      totalReferredSalons,
      pendingVerificationCount,
      activeReferralsCount,
      rejectedReferralsCount,
    ] = await Promise.all([
      ReferralProfileModel.countDocuments({ status: "active" }),
      ReferralModel.countDocuments(),
      ReferralModel.countDocuments({ status: "PENDING_VERIFICATION" }),
      ReferralModel.countDocuments({ status: "ACTIVE" }),
      ReferralModel.countDocuments({ status: "REJECTED" }),
    ]);

    // Financial calculations via aggregation
    const [rewardsAgg, commissionsAgg, pendingWithdrawalsAgg, paidWithdrawalsAgg] = await Promise.all([
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
    ]);

    const totalRewardsPaid = rewardsAgg[0]?.total || 0;
    const totalCommissionsPaid = commissionsAgg[0]?.total || 0;
    const totalEarnedAcrossPlatform = totalRewardsPaid + totalCommissionsPaid;
    const pendingWithdrawalAmount = pendingWithdrawalsAgg[0]?.total || 0;
    const pendingWithdrawalCount = pendingWithdrawalsAgg[0]?.count || 0;
    const totalPaidOut = paidWithdrawalsAgg[0]?.total || 0;
    const totalPaidOutCount = paidWithdrawalsAgg[0]?.count || 0;
    const totalAvailableInProfiles = Math.max(0, totalEarnedAcrossPlatform - totalPaidOut - pendingWithdrawalAmount);

    return NextResponse.json(
      {
        metrics: {
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
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/admin/referrals/overview error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message || String(error) },
      { status: 500 }
    );
  }
}
