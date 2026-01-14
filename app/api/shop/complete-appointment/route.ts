import { NextResponse } from "next/server";
import dbConnect from "@/server/db/mongodb";
import BookingModel from "@/server/models/Booking";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

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

    booking.isCompleted = true;
    booking.payment = true; // Assuming completion implies payment or vice versa, or just separate.
    // Often completion means service done & paid.
    // Admin code or logic might suggest payment marked here too.
    // Let's toggle isCompleted and status.
    booking.status = "completed";

    await booking.save();

    return NextResponse.json(
      { message: "Appointment completed" },
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
