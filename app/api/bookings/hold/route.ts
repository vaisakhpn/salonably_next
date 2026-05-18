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

    const holdToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes hold
    
    // Check if there is an EXPIRED hold we can atomically take over
    const expiredHold = await BookingModel.findOneAndUpdate(
      {
        shopId,
        slotDate,
        slotTime,
        status: "held",
        expiresAt: { $lt: new Date() }, // Must be strictly in the past
      },
      {
        $set: {
          userId: user?._id || null,
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
          expiresAt,
          holdToken,
        },
      },
      { new: true }
    );

    if (expiredHold) {
      // Successfully took over an expired hold!
      return NextResponse.json(
        { message: "Slot held successfully", holdToken },
        { status: 201 }
      );
    }

    // If there was no expired hold, we try to create a brand new one.
    // If multiple users try this at the exact same millisecond, MongoDB's 
    // unique partial index will accept 1 and throw a Duplicate Key Error (11000) for the rest!
    try {
      await BookingModel.create({
        userId: user?._id || null,
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
        expiresAt,
        holdToken,
      });

      return NextResponse.json(
        { message: "Slot held successfully", holdToken },
        { status: 201 }
      );
    } catch (createError: any) {
      // 11000 is MongoDB's Duplicate Key Error
      if (createError.code === 11000) {
        return NextResponse.json(
          { message: "Slot already booked or held by someone else" },
          { status: 409 }
        );
      }
      throw createError; // Re-throw if it's some other unexpected DB error
    }
  } catch (error: any) {
    console.error("Hold error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
