import { NextResponse } from "next/server";
import dbConnect from "@/server/db/mongodb";
import { getUser } from "@/server/middleware/auth";
import ReferralProfileModel from "@/server/models/ReferralProfile";
import ReferralTransactionModel from "@/server/models/ReferralTransaction";
import ShopModel from "@/server/models/Shop";

/**
 * GET /api/referral/transactions
 * Retrieves paginated financial ledger transactions for the authenticated user.
 */
export async function GET(req: Request) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const type = searchParams.get("type"); // optional: 'REFERRAL_BONUS' | 'BOOKING_COMMISSION' | 'WITHDRAWAL'

    await dbConnect();

    const profile = await ReferralProfileModel.findOne({ userId: user._id }).lean();

    if (!profile) {
      return NextResponse.json(
        { message: "Referral profile not found." },
        { status: 404 }
      );
    }

    const query: any = { referralProfileId: profile._id };
    if (type && type !== "ALL") {
      query.type = type;
    }

    const totalCount = await ReferralTransactionModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const skip = (page - 1) * limit;

    const rawTransactions = await ReferralTransactionModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Enrich transactions with shop names if applicable
    const enrichedTransactions = await Promise.all(
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
          createdAt: tx.createdAt,
        };
      })
    );

    return NextResponse.json(
      {
        transactions: enrichedTransactions,
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
    console.error("GET /api/referral/transactions error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message || String(error) },
      { status: 500 }
    );
  }
}
