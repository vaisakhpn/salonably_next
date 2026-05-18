import { NextResponse } from "next/server";
import dbConnect from "@/server/db/mongodb";
import BookingModel from "@/server/models/Booking";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const shopId = searchParams.get("shopId");

    if (!shopId) {
      return NextResponse.json(
        { message: "Shop ID is required" },
        { status: 400 },
      );
    }

    await dbConnect();

    // Fetch all future or current bookings for this shop that are 'booked', or 'held' and unexpired
    const bookings = await BookingModel.find({
      shopId,
      $or: [
        { status: "booked" },
        { status: "held", expiresAt: { $gt: new Date() } },
      ],
    }).select("slotDate slotTime");

    const occupiedSlots = bookings.map((b) => ({
      date: b.slotDate,
      time: b.slotTime,
    }));

    return NextResponse.json({ occupiedSlots }, { status: 200 });
  } catch (error) {
    console.error("Error fetching occupied slots:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
