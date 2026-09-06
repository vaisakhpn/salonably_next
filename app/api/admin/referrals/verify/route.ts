import { NextResponse } from "next/server";
import { isAdmin } from "@/server/middleware/auth";
import { verifyReferral, rejectReferral } from "@/server/services/referralService";

/**
 * POST /api/admin/referrals/verify
 * Allows admin to verify or reject a referred salon.
 * Verifying a salon automatically credits the ₹100 referral bonus to the referrer.
 */
export async function POST(req: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ message: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const body = await req.json();
    const { referralId, action, adminNote } = body;

    if (!referralId) {
      return NextResponse.json({ message: "Referral ID is required." }, { status: 400 });
    }

    if (action !== "VERIFY" && action !== "REJECT") {
      return NextResponse.json(
        { message: "Invalid action. Must be 'VERIFY' or 'REJECT'." },
        { status: 400 }
      );
    }

    if (action === "VERIFY") {
      const result = await verifyReferral(referralId, adminNote);
      if (!result.success) {
        return NextResponse.json({ message: result.message }, { status: 400 });
      }
      return NextResponse.json(
        {
          message: result.message,
          referral: result.referral,
        },
        { status: 200 }
      );
    } else {
      const result = await rejectReferral(referralId, adminNote);
      if (!result.success) {
        return NextResponse.json({ message: result.message }, { status: 400 });
      }
      return NextResponse.json(
        {
          message: result.message,
          referral: result.referral,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("POST /api/admin/referrals/verify error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message || String(error) },
      { status: 500 }
    );
  }
}
