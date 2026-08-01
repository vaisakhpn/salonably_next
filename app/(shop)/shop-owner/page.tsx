import Dashboard from "@/components/Shop/Dashboard";
import LoginUser from "@/components/Shop/LoginPage";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
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
    return (
      <div className="min-h-screen flex flex-col justify-between bg-slate-50">
        <Navbar />
        <main className="flex-1">
          <LoginUser />
        </main>
        <Footer />
      </div>
    );
  }

  let shopId;
  try {
    // Decode token to identify the specific shop
    const decoded = jwt.verify(token.value, JWT_SECRET) as any;
    shopId = decoded.shopId;
  } catch (error) {
    // Invalid token, render login with Navbar & Footer
    return (
      <div className="min-h-screen flex flex-col justify-between bg-slate-50">
        <Navbar />
        <main className="flex-1">
          <LoginUser />
        </main>
        <Footer />
      </div>
    );
  }

  await dbConnect();

  const bookingsCount = await BookingModel.countDocuments({ shopId: shopId });
  const distinctUsers = await BookingModel.distinct("userId", {
    shopId: shopId,
  });

  const latestBookings = await BookingModel.find({ shopId: shopId })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const shop = await ShopModel.findById(shopId).select("name").lean();

  const dashData = {
    shopName: shop?.name || "Shop Owner",
    shops: 1,
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
