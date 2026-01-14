import Allbooking from "@/components/Admin/AllBookings";
import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dbConnect from "@/server/db/mongodb";
import BookingModel from "@/server/models/Booking";

const page = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (!token) {
    redirect("/admin");
  }

  await dbConnect();

  const bookings = await BookingModel.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div>
      <Allbooking bookings={JSON.parse(JSON.stringify(bookings))} />
    </div>
  );
};

export default page;
