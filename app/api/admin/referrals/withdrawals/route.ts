import { NextResponse } from "next/server";
import dbConnect from "@/server/db/mongodb";
import { isAdmin } from "@/server/middleware/auth";
import WithdrawalRequestModel from "@/server/models/WithdrawalRequest";
import ReferralProfileModel from "@/server/models/ReferralProfile";
import UserModel from "@/server/models/User";
import { processWithdrawal } from "@/server/services/withdrawalService";

/**
 * GET /api/admin/referrals/withdrawals
 * Returns all withdrawal requests with referrer profiles and payout metrics.
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

    const [totalCount, pendingAgg, paidAgg] = await Promise.all([
      WithdrawalRequestModel.countDocuments(query),
      WithdrawalRequestModel.aggregate([
        { $match: { status: "PENDING" } },
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
      WithdrawalRequestModel.aggregate([
        { $match: { status: "PAID" } },
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
    ]);

    const totalPages = Math.ceil(totalCount / limit) || 1;
    const skip = (page - 1) * limit;

    const rawRequests = await WithdrawalRequestModel.find(query)
      .sort({ requestedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const enrichedWithdrawals = await Promise.all(
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
          requestedAt: reqItem.requestedAt,
          paidAt: reqItem.paidAt,
          rejectedAt: reqItem.rejectedAt,
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

    return NextResponse.json(
      {
        withdrawals: enrichedWithdrawals,
        metrics: {
          pendingCount: pendingAgg[0]?.count || 0,
          pendingAmount: pendingAgg[0]?.total || 0,
          paidCount: paidAgg[0]?.count || 0,
          paidAmount: paidAgg[0]?.total || 0,
        },
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
    console.error("GET /api/admin/referrals/withdrawals error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message || String(error) },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/referrals/withdrawals
 * Allows admin to mark a withdrawal as PAID (with UTR reference) or REJECTED.
 */
export async function PUT(req: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const body = await req.json();
    const { withdrawalId, action, paymentReference, adminNote } = body;

    if (!withdrawalId) {
      return NextResponse.json({ message: "Withdrawal ID is required." }, { status: 400 });
    }

    if (action !== "PAY" && action !== "REJECT") {
      return NextResponse.json(
        { message: "Invalid action. Must be 'PAY' or 'REJECT'." },
        { status: 400 }
      );
    }

    const result = await processWithdrawal({
      withdrawalId,
      action,
      paymentReference,
      adminNote,
    });

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: result.message,
        withdrawal: result.withdrawal,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PUT /api/admin/referrals/withdrawals error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message || String(error) },
      { status: 500 }
    );
  }
}
