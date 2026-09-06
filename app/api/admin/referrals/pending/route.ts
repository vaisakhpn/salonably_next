import { NextResponse } from "next/server";
import dbConnect from "@/server/db/mongodb";
import { isAdmin } from "@/server/middleware/auth";
import ReferralModel from "@/server/models/Referral";
import ShopModel from "@/server/models/Shop";
import UserModel from "@/server/models/User";

/**
 * GET /api/admin/referrals/pending
 * Fetches all salon referrals waiting for admin verification.
 */
export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Unauthorized. Admin access required." }, { status: 401 });
    }

    await dbConnect();

    const pendingReferrals = await ReferralModel.find({
      status: "PENDING_VERIFICATION",
    })
      .sort({ createdAt: -1 })
      .lean();

    // Fetch related shop and referrer details
    const enrichedList = await Promise.all(
      pendingReferrals.map(async (ref: any) => {
        const [shop, user] = await Promise.all([
          ShopModel.findById(ref.referredShopId)
            .select("name ownerName email phone image address date fees available")
            .lean(),
          UserModel.findById(ref.referrerUserId)
            .select("name email image phone")
            .lean(),
        ]);

        return {
          id: ref._id.toString(),
          referrerPhone: ref.referrerPhone,
          shopPhone: ref.shopPhone,
          status: ref.status,
          initialRewardAmount: ref.initialRewardAmount,
          initialRewardStatus: ref.initialRewardStatus,
          createdAt: ref.createdAt,
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

    return NextResponse.json(
      {
        pendingCount: enrichedList.length,
        referrals: enrichedList,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/admin/referrals/pending error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message || String(error) },
      { status: 500 }
    );
  }
}
