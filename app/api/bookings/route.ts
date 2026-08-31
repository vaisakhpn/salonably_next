import { NextResponse } from "next/server";
import dbConnect from "../../../server/db/mongodb";
import BookingModel from "../../../server/models/Booking";
import ShopModel from "../../../server/models/Shop";
import UserModel from "../../../server/models/User";
import { getUser } from "@/server/middleware/auth";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { parseSlotDateTime } from "@/lib/utils";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    // Rate limit: max 5 booking creations per minute per IP
    const clientIp = getClientIp(req);
    const limiter = rateLimit(`book_${clientIp}`, 5, 60000);

    if (!limiter.success) {
      return NextResponse.json(
        { message: "Too many booking requests. Please wait a moment and try again." },
        { status: 429 },
      );
    }

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

      // Sync slots_booked on ShopModel
      await ShopModel.findByIdAndUpdate(shopId, {
        $addToSet: { [`slots_booked.${slotDate}`]: slotTime },
      }).catch((e) => console.error("Error updating shop slots_booked:", e));

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

    try {
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

      // Sync slots_booked on ShopModel
      await ShopModel.findByIdAndUpdate(shopId, {
        $addToSet: { [`slots_booked.${slotDate}`]: slotTime },
      }).catch((e) => console.error("Error updating shop slots_booked:", e));

      return NextResponse.json(
        { message: "Booking successful", booking: newBooking },
        { status: 201 },
      );
    } catch (createError: any) {
      if (createError.code === 11000) {
        return NextResponse.json(
          { message: "Slot already booked or held" },
          { status: 409 }
        );
      }
      throw createError;
    }
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

    // Fetch bookings cleanly with .lean() for fast, memory-efficient reads
    const rawBookings = await BookingModel.find({ userId: user._id })
      .sort({ _id: -1 })
      .lean();

    const now = new Date();

    // Determine completion status virtually for the read response without blocking DB writes
    const bookings = rawBookings.map((booking: any) => {
      let isCompleted = booking.isCompleted || false;
      let status = booking.status;

      if (status === "booked") {
        try {
          const bookingDateTime = parseSlotDateTime(
            booking.slotDate,
            booking.slotTime,
          );

          if (bookingDateTime && bookingDateTime < now) {
            status = "completed";
            isCompleted = true;
          }
        } catch (e) {
          // Keep current status if parsing fails
        }
      }

      return {
        ...booking,
        status,
        isCompleted,
      };
    });

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
