import { NextResponse } from "next/server";
import dbConnect from "../../../../server/db/mongodb";
import BookingModel from "../../../../server/models/Booking";
import { getUser } from "@/server/middleware/auth";

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { message: "Booking ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const booking = await BookingModel.findOne({
      _id: bookingId,
      userId: user._id,
    });

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found or unauthorized" },
        { status: 404 }
      );
    }

    if (booking.status === "cancelled") {
      return NextResponse.json(
        { message: "Booking is already cancelled" },
        { status: 400 }
      );
    }

    if (booking.status === "completed") {
      return NextResponse.json(
        { message: "Cannot cancel completed booking" },
        { status: 400 }
      );
    }

    booking.status = "cancelled";
    booking.cancelled = true;
    booking.cancelledBy = "user";
    await booking.save();

    return NextResponse.json(
      { message: "Booking cancelled successfully" },
      { status: 200 }
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
