import { NextResponse } from "next/server";
import dbConnect from "@/server/db/mongodb";
import BookingModel from "@/server/models/Booking";
import { getUser } from "@/server/middleware/auth";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const user = await getUser();
    const body = await req.json();
    const { shopId, slotDate, slotTime, shopData, amount } = body;

    if (!shopId || !slotDate || !slotTime) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    await dbConnect();

    // Check if slot is already booked or held actively
    const existing = await BookingModel.findOne({
      shopId,
      slotDate,
      slotTime,
      $or: [
        { status: "booked" },
        { status: "held", expiresAt: { $gt: new Date() } },
      ],
    });

    if (existing) {
      return NextResponse.json(
        { message: "Slot already booked or held by someone else" },
        { status: 409 },
      );
    }

    const holdToken = crypto.randomUUID();

    const newHold = await BookingModel.create({
      userId: user?._id || null, // Optional for hold
      shopId,
      slotDate,
      slotTime,
      bookingTime: new Date(),
      userData: {
        name: user?.name || "Guest",
        email: user?.email || "",
        phone: user?.phone || "",
      },
      shopData: {
        name: shopData?.name || "",
        address: shopData?.address || {},
        image: shopData?.image || "",
      },
      amount: amount || 0,
      date: Date.now(),
      status: "held",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes hold
      holdToken,
    });

    return NextResponse.json(
      { message: "Slot held successfully", holdToken },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Hold error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
