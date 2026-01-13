import { NextResponse } from "next/server";
import dbConnect from "../../../server/db/mongodb";
import BookingModel from "../../../server/models/Booking";
import { getUser } from "../../../server/auth";

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { shopId, slotDate, slotTime, shopData, amount } = body;

    if (!shopId || !slotDate || !slotTime || !amount) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();

    // prevent double booking?
    // strict check: if slot is already taken for this shop/date/time
    // For now, let's assume the frontend filters available slots,
    // but good to have a backend check.
    const existing = await BookingModel.findOne({
      shopId,
      slotDate,
      slotTime,
      status: "booked",
    });

    if (existing) {
      return NextResponse.json(
        { message: "Slot already booked" },
        { status: 409 }
      );
    }

    const newBooking = await BookingModel.create({
      userId: user._id,
      shopId,
      slotDate,
      slotTime,
      bookingTime: new Date(),
      userData: {
        name: user.name,
        email: user.email,
        image: user.image,
      },
      shopData,
      amount,
      date: Date.now(),
      status: "booked",
    });

    return NextResponse.json(
      { message: "Booking successful", booking: newBooking },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const bookings = await BookingModel.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
