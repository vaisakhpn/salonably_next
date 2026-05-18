import { NextResponse } from "next/server";
import dbConnect from "../../../server/db/mongodb";
import BookingModel from "../../../server/models/Booking";
import UserModel from "../../../server/models/User";
import { getUser } from "@/server/middleware/auth";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    let user = await getUser();
    const body = await req.json();
    const { shopId, slotDate, slotTime, shopData, amount, guestDetails, holdToken } = body;

    await dbConnect();

    // If no user logged in, check for guest details
    if (!user) {
      if (guestDetails && guestDetails.name && guestDetails.phone) {
        // Guest booking: Create a dummy user object for the booking
        user = {
          _id: null,
          name: guestDetails.name,
          email: "", // Email not required for guest
          phone: guestDetails.phone,
          image: "", // Placeholder for guest
        };
      } else {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
    }

    // Ensure user is defined (TypeScript narrowing)
    // Note: user._id can be null for guests
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!shopId || !slotDate || !slotTime || amount === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    if (holdToken) {
      // Find the held booking and update it
      const heldBooking = await BookingModel.findOne({
        shopId,
        slotDate,
        slotTime,
        holdToken,
        status: "held",
        expiresAt: { $gt: new Date() },
      });

      if (!heldBooking) {
        return NextResponse.json(
          { message: "Hold expired or invalid. Please try selecting the slot again." },
          { status: 400 },
        );
      }

      // Confirm the booking
      heldBooking.status = "booked";
      heldBooking.userId = user._id;
      heldBooking.userData = {
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      };
      // Remove hold fields
      heldBooking.expiresAt = undefined;
      heldBooking.holdToken = undefined;

      await heldBooking.save();

      return NextResponse.json(
        { message: "Booking successful", booking: heldBooking },
        { status: 201 },
      );
    }

    // If no holdToken is provided, fallback to checking and creating directly
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
        { message: "Slot already booked or held" },
        { status: 409 },
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
        phone: user.phone || "",
      },
      shopData: {
        name: shopData.name,
        address: shopData.address,
        image: shopData.image,
      },
      amount,
      date: Date.now(),
      status: "booked",
    });

    return NextResponse.json(
      { message: "Booking successful", booking: newBooking },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 },
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

    // Fetch bookings
    let bookings = await BookingModel.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    const now = new Date();
    const currentYear = now.getFullYear();
    const updates = [];

    // Check for past bookings and update status
    for (const booking of bookings) {
      if (booking.status === "booked") {
        try {
          // Construct date string: "20 Jan 2026 10:00 AM"
          const dateString = `${booking.slotDate} ${currentYear} ${booking.slotTime}`;
          const bookingDateTime = new Date(dateString);

          // Handle year boundary (e.g., booking in Jan 2026, current date Dec 2025 - unlikely with current logic but good to keep in mind)
          // For now, assuming current year is fine as slots are generated for next 7 days.

          if (bookingDateTime < now) {
            booking.status = "completed";
            booking.isCompleted = true;
            updates.push(booking.save());
          }
        } catch (e) {
          console.error("Error parsing date for booking:", booking._id, e);
        }
      }
    }

    if (updates.length > 0) {
      await Promise.all(updates);
    }

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
