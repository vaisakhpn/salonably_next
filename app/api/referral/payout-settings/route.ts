import { NextResponse } from "next/server";
import dbConnect from "@/server/db/mongodb";
import { getUser } from "@/server/middleware/auth";
import ReferralProfileModel from "@/server/models/ReferralProfile";
import { normalizePhoneNumber } from "@/server/services/referralService";

/**
 * GET /api/referral/payout-settings
 * Returns the user's saved UPI payout settings.
 */
export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const profile = await ReferralProfileModel.findOne({ userId: user._id })
      .select("payoutMethod upiId upiPhone")
      .lean();

    if (!profile) {
      return NextResponse.json({ message: "Referral profile not found." }, { status: 404 });
    }

    return NextResponse.json(
      {
        payoutMethod: profile.payoutMethod || "UPI_ID",
        upiId: profile.upiId || "",
        upiPhone: profile.upiPhone || "",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/referral/payout-settings error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message || String(error) },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/referral/payout-settings
 * Updates the user's preferred payout method (UPI ID or UPI Phone).
 */
export async function PUT(req: Request) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { payoutMethod, upiId, upiPhone } = body;

    if (payoutMethod !== "UPI_ID" && payoutMethod !== "UPI_PHONE") {
      return NextResponse.json(
        { message: "Invalid payout method. Must be 'UPI_ID' or 'UPI_PHONE'." },
        { status: 400 }
      );
    }

    let cleanUpiId = (upiId || "").trim();
    let cleanUpiPhone = normalizePhoneNumber(upiPhone || "");

    if (payoutMethod === "UPI_ID" && !cleanUpiId) {
      return NextResponse.json({ message: "Please provide a valid UPI ID (e.g. user@upi)." }, { status: 400 });
    }

    if (payoutMethod === "UPI_PHONE" && (!cleanUpiPhone || cleanUpiPhone.length !== 10)) {
      return NextResponse.json(
        { message: "Please provide a valid 10-digit UPI-linked phone number." },
        { status: 400 }
      );
    }

    await dbConnect();

    const updated = await ReferralProfileModel.findOneAndUpdate(
      { userId: user._id },
      {
        payoutMethod,
        upiId: cleanUpiId,
        upiPhone: cleanUpiPhone,
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: "Referral profile not found." }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Payout settings updated successfully!",
        settings: {
          payoutMethod: updated.payoutMethod,
          upiId: updated.upiId,
          upiPhone: updated.upiPhone,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PUT /api/referral/payout-settings error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message || String(error) },
      { status: 500 }
    );
  }
}
