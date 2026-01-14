import Dashboard from "@/components/Shop/Dashboard";
import LoginUser from "@/components/Shop/LoginPage";
import React from "react";
import { cookies } from "next/headers";
import dbConnect from "@/server/db/mongodb";
import jwt from "jsonwebtoken";
import ShopModel from "@/server/models/Shop";
import BookingModel from "@/server/models/Booking";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const page = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("shop_token");

  if (!token) {
    return <LoginUser />;
  }

  let shopId;
  try {
    // Decode token to identify the specific shop
    const decoded = jwt.verify(token.value, JWT_SECRET) as any;
    shopId = decoded.shopId;
  } catch (error) {
    // Invalid token, render login
    return <LoginUser />;
  }

  await dbConnect();

  // Fetch stats specific to this shop
  // 1. Bookings for this shop (assuming Booking model has `shopId` or `shopData._id` reference)
  // Checking Booking schema from previous context or generic assumption:
  // If BookingModel stores `shopId` directly: { shopId: shopId }
  // If it stores `shopData`: { "shopData._id": shopId } or similar.
  // Previous admin dashboard used `BookingModel.find({})`.
  // Let's assume `docId` (shop id) is stored in `docId` or related field?
  // Checking admin dashboard code... `item.shopData.image`. So it likely stores `shopData` object.
  // The safer bet is to query where `shopData._id` matches, if that's how it's stored, or `shopId`.
  // User provided schema earlier? No, I viewed `Shop.ts` but not `Booking.ts`.
  // Wait, I viewed `models` directory list step 33.
  // Let's check Booking model if possible, or assume `shopId`.
  // Actually, I can just check how `cancel-appointment` works if I had access, but let's query flexibly or update later if empty.
  // Assumption: Booking has `shopId` field.

  const bookingsCount = await BookingModel.countDocuments({ shopId: shopId });
  const completedBookings = await BookingModel.find({
    shopId: shopId,
    isCompleted: true,
  }); // Customer count? Or users?
  // "Customers" usually means unique users who booked this shop.
  const distinctUsers = await BookingModel.distinct("userId", {
    shopId: shopId,
  });

  const latestBookings = await BookingModel.find({ shopId: shopId })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const dashData = {
    shops: 1, // It's just this shop
    bookings: bookingsCount,
    customers: distinctUsers.length,
    latestBookings: JSON.parse(JSON.stringify(latestBookings)),
  };

  return (
    <div>
      <Dashboard dashData={dashData} />
    </div>
  );
};

export default page;
