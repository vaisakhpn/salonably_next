import { NextResponse } from "next/server";
import dbConnect from "@/server/db/mongodb";
import { isAdmin } from "@/server/middleware/auth";
import ReferralModel from "@/server/models/Referral";
import ReferralProfileModel from "@/server/models/ReferralProfile";
import ShopModel from "@/server/models/Shop";
import UserModel from "@/server/models/User";

/**
 * GET /api/admin/referrals/list
 * Returns paginated referrals directory for admin with filters and search.
 */
export async function GET(req: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));

    await dbConnect();

    const query: any = {};
    if (status && status !== "ALL") {
      query.status = status;
    }

    const totalCount = await ReferralModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const skip = (page - 1) * limit;

    const referrals = await ReferralModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const enrichedList = await Promise.all(
      referrals.map(async (ref: any) => {
        const [shop, user, profile] = await Promise.all([
          ShopModel.findById(ref.referredShopId)
            .select("name ownerName email phone image address fees available")
            .lean(),
          UserModel.findById(ref.referrerUserId)
            .select("name email phone image")
            .lean(),
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
          verifiedAt: ref.verifiedAt,
          rejectedAt: ref.rejectedAt,
          adminNote: ref.adminNote,
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

    return NextResponse.json(
      {
        referrals: enrichedList,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/admin/referrals/list error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message || String(error) },
      { status: 500 }
    );
  }
}
