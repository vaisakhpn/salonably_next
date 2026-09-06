import { NextResponse } from "next/server";
import dbConnect from "@/server/db/mongodb";
import { getUser } from "@/server/middleware/auth";
import ReferralProfileModel from "@/server/models/ReferralProfile";
import WithdrawalRequestModel from "@/server/models/WithdrawalRequest";
import { requestWithdrawal } from "@/server/services/withdrawalService";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

/**
 * GET /api/referral/withdraw
 * Retrieves the authenticated user's withdrawal request history.
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
      return NextResponse.json({ message: "Referral profile not found." }, { status: 404 });
    }

    const requests = await WithdrawalRequestModel.find({
      referralProfileId: profile._id,
    })
      .sort({ requestedAt: -1 })
      .lean();

    const formattedRequests = requests.map((req: any) => ({
      id: req._id.toString(),
      amount: req.amount,
      payoutMethod: req.payoutMethod,
      payoutAddress: req.payoutAddress,
      status: req.status,
      paymentReference: req.paymentReference,
      adminNote: req.adminNote,
      requestedAt: req.requestedAt,
      paidAt: req.paidAt,
      rejectedAt: req.rejectedAt,
    }));

    return NextResponse.json(
      {
        total: formattedRequests.length,
        withdrawals: formattedRequests,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/referral/withdraw error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message || String(error) },
      { status: 500 }
    );
  }
}


/**
 * POST /api/referral/withdraw
 * Creates a new withdrawal request for the user and immediately reserves the funds.
 */
export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const limiter = rateLimit(`with_${clientIp}`, 5, 60000);

    if (!limiter.success) {
      return NextResponse.json(
        { message: "Too many withdrawal requests. Please wait a minute and try again." },
        { status: 429 }
      );
    }

    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, payoutMethod, payoutAddress } = body;

    if (!amount || isNaN(Number(amount))) {
      return NextResponse.json({ message: "Please provide a valid withdrawal amount." }, { status: 400 });
    }

    if (!payoutMethod || !payoutAddress) {
      return NextResponse.json({ message: "Please select a payout method and address." }, { status: 400 });
    }

    const result = await requestWithdrawal({
      userId: user._id,
      amount: Number(amount),
      payoutMethod,
      payoutAddress,
    });

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        message: result.message,
        withdrawal: result.withdrawal,
        availableBalance: result.availableBalance,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/referral/withdraw error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message || String(error) },
      { status: 500 }
    );
  }
}
