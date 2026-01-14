import ShopBooking from "@/components/Shop/ShopBooking";
import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dbConnect from "@/server/db/mongodb";
import BookingModel from "@/server/models/Booking";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const page = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("shop_token");

  if (!token) {
    redirect("/shop-owner");
  }

  let shopId;
  try {
    const decoded: any = jwt.verify(token.value, JWT_SECRET);
    shopId = decoded.shopId;
  } catch (e) {
    redirect("/shop-owner");
  }

  await dbConnect();

  // Fetch bookings for this shop
  const bookings = await BookingModel.find({ shopId })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div>
      <ShopBooking bookings={JSON.parse(JSON.stringify(bookings))} />
    </div>
  );
};

export default page;
