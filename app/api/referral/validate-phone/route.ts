import { NextResponse } from "next/server";
import { validateReferrerPhone } from "@/server/services/referralService";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

/**
 * GET /api/referral/validate-phone?phone=...
 * Validates whether a referral phone number is valid and registered to an active profile.
 * Protected by sliding window rate limiting (15 requests/min per IP) to prevent directory enumeration.
 */
export async function GET(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const limiter = rateLimit(`val_phone_${clientIp}`, 15, 60000);

    if (!limiter.success) {
      return NextResponse.json(
        { valid: false, message: "Too many validation attempts. Please wait a minute." },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        { valid: false, message: "Phone number query parameter is required." },
        { status: 400 }
      );
    }

    const result = await validateReferrerPhone(phone);

    if (!result.valid) {
      return NextResponse.json(
        { valid: false, message: result.message || "Invalid referral phone number." },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        valid: true,
        referrerName: result.profile?.referrerName || "Verified LockMyTime Member",
        referrerPhone: result.profile?.phone,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("GET /api/referral/validate-phone error:", error);
    return NextResponse.json(
      { valid: false, message: "Error validating referral phone number." },
      { status: 500 }
    );
  }
}
