import { NextResponse } from "next/server";
import dbConnect from "@/server/db/mongodb";
import { isAdmin } from "@/server/middleware/auth";
import ReferralSettingModel from "@/server/models/ReferralSetting";
import { getOrCreateReferralSettings } from "@/server/services/referralService";

/**
 * GET /api/admin/referrals/settings
 * Retrieves current referral program settings.
 */
export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const settings = await getOrCreateReferralSettings();

    return NextResponse.json({ settings }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/admin/referrals/settings error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message || String(error) },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/referrals/settings
 * Updates referral program reward parameters (₹100 bonus, ₹5 commission, minimum withdrawal).
 */
export async function PUT(req: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const body = await req.json();
    const { initialRewardAmount, bookingCommissionAmount, minWithdrawalAmount, isProgramActive } = body;

    await dbConnect();

    const updated = await ReferralSettingModel.findOneAndUpdate(
      { key: "global" },
      {
        initialRewardAmount: Number(initialRewardAmount) >= 0 ? Number(initialRewardAmount) : 100,
        bookingCommissionAmount: Number(bookingCommissionAmount) >= 0 ? Number(bookingCommissionAmount) : 5,
        minWithdrawalAmount: Number(minWithdrawalAmount) >= 1 ? Number(minWithdrawalAmount) : 100,
        isProgramActive: isProgramActive !== undefined ? Boolean(isProgramActive) : true,
      },
      { new: true, upsert: true }
    );

    return NextResponse.json(
      {
        message: "Referral program settings updated successfully!",
        settings: updated,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PUT /api/admin/referrals/settings error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message || String(error) },
      { status: 500 }
    );
  }
}
