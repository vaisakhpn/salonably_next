import Dashboard from "@/components/Admin/Dashboard";
import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dbConnect from "@/server/db/mongodb";
import ShopModel from "@/server/models/Shop";
import UserModel from "@/server/models/User";
import BookingModel from "@/server/models/Booking";

const page = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (!token) {
    redirect("/admin/login");
  }

  await dbConnect();

  const shopsCount = await ShopModel.countDocuments();
  const bookingsCount = await BookingModel.countDocuments();
  const usersCount = await UserModel.countDocuments();

  // Fetch latest bookings with populated data
  // Note: Mongoose return generic Objects, need to be serialized for Client Components if they are complex types
  const latestBookings = await BookingModel.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // We need to manually populate or fetch related data if 'populate' isn't working as expected or to keep it simple
  // Assuming the BookingModel schema stores full objects or we fetch them.
  // Let's look at the schema implicitly. The previous code accessed `item.shopData.image`.
  // If the booking model only stores IDs, we need to populate.
  // The User previously mentioned "Populate simple shop/user if references existed, but schema stores objects."
  // So we assume the data is there.

  const dashData = {
    shops: shopsCount,
    bookings: bookingsCount,
    customers: usersCount,
    latestBookings: JSON.parse(JSON.stringify(latestBookings)), // Serialize for Next.js
  };

  return (
    <div>
      <Dashboard dashData={dashData} />
    </div>
  );
};

export default page;
