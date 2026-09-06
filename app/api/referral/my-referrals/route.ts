import { NextResponse } from "next/server";
import dbConnect from "@/server/db/mongodb";
import { getUser } from "@/server/middleware/auth";
import ReferralProfileModel from "@/server/models/ReferralProfile";
import ReferralModel from "@/server/models/Referral";
import ShopModel from "@/server/models/Shop";

/**
 * GET /api/referral/my-referrals
 * Retrieves all salons referred by the authenticated user with status and performance metrics.
 */
export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const profile = await ReferralProfileModel.findOne({ userId: user._id }).lean();

    if (!profile) {
      return NextResponse.json(
        { message: "Referral profile not found. Please activate your profile first." },
        { status: 404 }
      );
    }

    const referrals = await ReferralModel.find({
      referrerProfileId: profile._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    // Fetch shop details for each referral
    const enrichedReferrals = await Promise.all(
      referrals.map(async (ref: any) => {
        const shop = await ShopModel.findById(ref.referredShopId)
          .select("name ownerName phone email image address available")
          .lean();

        const initialRewardEarned = ref.initialRewardStatus === "CREDITED" ? ref.initialRewardAmount : 0;
        const totalEarnedFromSalon = initialRewardEarned + (ref.totalCommissionEarned || 0);

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
          verifiedAt: ref.verifiedAt,
          createdAt: ref.createdAt,
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

    return NextResponse.json(
      {
        totalReferrals: enrichedReferrals.length,
        referrals: enrichedReferrals,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/referral/my-referrals error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message || String(error) },
      { status: 500 }
    );
  }
}
