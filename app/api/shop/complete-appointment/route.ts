import { NextResponse } from "next/server";
import dbConnect from "@/server/db/mongodb";
import BookingModel from "@/server/models/Booking";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { creditBookingCommission } from "@/server/services/referralService";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("shop_token");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify token and get shopId
    const decoded = jwt.verify(token.value, JWT_SECRET) as any;
    const shopId = decoded.shopId;

    const { appointmentId } = await req.json();

    if (!appointmentId) {
      return NextResponse.json({ message: "Appointment ID is required" }, { status: 400 });
    }

    await dbConnect();

    const booking = await BookingModel.findById(appointmentId);

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    // Ensure the booking belongs to this shop
    if (booking.shopId !== shopId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Guard against completing cancelled bookings
    if (booking.cancelled || booking.status === "cancelled") {
      return NextResponse.json(
        { message: "Cannot complete a cancelled appointment." },
        { status: 400 }
      );
    }

    const wasAlreadyCompleted = booking.isCompleted || booking.status === "completed";

    booking.isCompleted = true;
    booking.payment = true;
    booking.status = "completed";

    await booking.save();

    // Trigger Referral Booking Commission (Idempotent: only awarded once per completed booking)
    if (!wasAlreadyCompleted) {
      try {
        await creditBookingCommission(booking._id, booking.shopId);
      } catch (commissionError) {
        console.error("Error awarding referral booking commission:", commissionError);
      }
    }

    return NextResponse.json(
      { message: "Appointment completed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Complete appointment error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
