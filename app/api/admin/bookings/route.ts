import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/server/db/mongodb";
import BookingModel from "@/server/models/Booking";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");
  if (!token) return false;
  try {
    jwt.verify(token.value, JWT_SECRET);
    return true;
  } catch (e) {
    return false;
  }
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    // Populate simple shop/user if references existed, but schema stores objects.
    const bookings = await BookingModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching bookings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { bookingId } = await req.json();
    await dbConnect();

    // Cancel booking
    const updated = await BookingModel.findByIdAndUpdate(
      bookingId,
      {
        status: "cancelled",
        cancelled: true,
        cancelledBy: "system", // or 'admin'
        cancelledAt: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Booking cancelled", booking: updated },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating booking" },
      { status: 500 }
    );
  }
}
