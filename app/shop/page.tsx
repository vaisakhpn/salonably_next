import Dashboard from "@/components/Shop/Dashboard";
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
    redirect("/admin/login"); // Or shop login if separate
  }

  let shopId;
  try {
    const decoded: any = jwt.verify(token.value, JWT_SECRET);
    shopId = decoded.shopId;
  } catch (e) {
    redirect("/admin/login");
  }

  await dbConnect();

  // Fetch stats for this shop
  const bookingsCount = await BookingModel.countDocuments({ shopId }); // Assuming booking has shopId

  // Calculate unique customers
  const uniqueCustomers = await BookingModel.distinct("userId", { shopId });
  const customersCount = uniqueCustomers.length;

  const latestBookings = await BookingModel.find({ shopId })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const dashData = {
    bookings: bookingsCount,
    customers: customersCount,
    latestBookings: JSON.parse(JSON.stringify(latestBookings)),
  };

  return (
    <div>
      <Dashboard dashData={dashData} />
    </div>
  );
};

export default page;
