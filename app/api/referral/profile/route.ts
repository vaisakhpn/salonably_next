import { NextResponse } from "next/server";
import dbConnect from "@/server/db/mongodb";
import { getUser } from "@/server/middleware/auth";
import ReferralProfileModel from "@/server/models/ReferralProfile";
import UserModel from "@/server/models/User";
import { normalizePhoneNumber, recalculateProfileBalances } from "@/server/services/referralService";

/**
 * GET /api/referral/profile
 * Retrieves the logged-in user's referral profile, status, and live balances.
 */
export async function GET() {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized. Please log in." }, { status: 401 });
    }

    await dbConnect();

    const profile = await ReferralProfileModel.findOne({ userId: user._id }).lean();

    if (!profile) {
      return NextResponse.json(
        {
          hasProfile: false,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone || "",
          },
        },
        { status: 200 }
      );
    }

    // Recalculate balances to ensure real-time ledger consistency
    const freshBalances = await recalculateProfileBalances(profile._id);

    return NextResponse.json(
      {
        hasProfile: true,
        profile: {
          ...profile,
          ...freshBalances,
        },
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: profile.phone,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/referral/profile error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message || String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST /api/referral/profile
 * Enrolls the logged-in user into the Referral & Earn program.
 */
export async function POST(req: Request) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized. Please log in." }, { status: 401 });
    }

    const body = await req.json();
    const { phone, upiId, upiPhone, payoutMethod } = body;

    const normalizedPhone = normalizePhoneNumber(phone || user.phone || "");

    if (!normalizedPhone || normalizedPhone.length < 10) {
      return NextResponse.json(
        { message: "Please provide a valid 10-digit phone number." },
        { status: 400 }
      );
    }

    await dbConnect();

    // 1. Check if this user already has a referral profile
    let existingProfile = await ReferralProfileModel.findOne({ userId: user._id });
    if (existingProfile) {
      return NextResponse.json(
        {
          message: "Referral profile already exists.",
          profile: existingProfile,
          hasProfile: true,
        },
        { status: 200 }
      );
    }

    // 2. Check if another user is already using this phone number for referrals
    const phoneInUse = await ReferralProfileModel.findOne({
      phone: normalizedPhone,
      userId: { $ne: user._id },
    });

    if (phoneInUse) {
      return NextResponse.json(
        {
          message: "This phone number is already linked to another referral account. Please enter your own phone number.",
        },
        { status: 400 }
      );
    }

    // 3. Create the new Referral Profile
    const newProfile = await ReferralProfileModel.create({
      userId: user._id,
      phone: normalizedPhone,
      phoneVerified: true,
      payoutMethod: payoutMethod === "UPI_PHONE" ? "UPI_PHONE" : "UPI_ID",
      upiId: (upiId || "").trim(),
      upiPhone: (upiPhone || normalizedPhone).trim(),
      status: "active",
      totalEarned: 0,
      availableBalance: 0,
      pendingBalance: 0,
      withdrawnAmount: 0,
    });

    // 4. Update the user's primary phone on User record if missing
    if (!user.phone) {
      await UserModel.findByIdAndUpdate(user._id, { phone: normalizedPhone }).catch((err) =>
        console.warn("Could not sync phone to User model:", err)
      );
    }

    return NextResponse.json(
      {
        message: "Referral profile activated successfully! Welcome to Refer & Earn.",
        profile: newProfile,
        hasProfile: true,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/referral/profile error:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "A referral profile with this phone number or user account already exists." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error", error: error.message || String(error) },
      { status: 500 }
    );
  }
}
