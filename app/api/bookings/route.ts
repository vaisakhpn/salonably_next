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
    const { shopId, slotDate, slotTime, shopData, amount, guestDetails } = body;

    await dbConnect();

    // If no user logged in, check for guest details
    if (!user) {
      if (guestDetails && guestDetails.name && guestDetails.email) {
        // Check if user exists
        let existingUser = await UserModel.findOne({
          email: guestDetails.email,
        });

        if (existingUser) {
          user = existingUser;
        } else {
          // Create new user
          const password = guestDetails.name + "123";
          const hashedPassword = await bcrypt.hash(password, 10);

          const newUser = await UserModel.create({
            name: guestDetails.name,
            email: guestDetails.email,
            password: hashedPassword,
            phone: guestDetails.phone || "",
          });

          user = newUser;

          // Auto-login the new user by setting the cookie
          const token = jwt.sign(
            { userId: newUser._id, email: newUser.email, phone: newUser.phone },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
          );

          (await cookies()).set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
          });
        }
      } else {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
    }

    // Ensure user is defined (TypeScript narrowing)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!shopId || !slotDate || !slotTime || !amount) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

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
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
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
