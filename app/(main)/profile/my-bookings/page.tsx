import MyBookings from "@/components/ui/Profile/MyBookings";
import React from "react";
import dbConnect from "@/server/db/mongodb";
import BookingModel from "@/server/models/Booking";
import { getUser } from "@/server/middleware/auth";
import { redirect } from "next/navigation";
import { parseSlotDateTime } from "@/lib/utils";

const page = async () => {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  await dbConnect();

  // Fast lean query
  const bookingsData = await BookingModel.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .lean();

  const bookings = JSON.parse(JSON.stringify(bookingsData));

  // Compute status and update past bookings in background
  const now = new Date();
  const pastUncompletedIds: string[] = [];

  bookings.forEach((booking: any) => {
    if (booking.status === "booked") {
      const slotDateTime = parseSlotDateTime(booking.slotDate, booking.slotTime);
      if (slotDateTime && slotDateTime < now) {
        booking.status = "completed";
        booking.isCompleted = true;
        pastUncompletedIds.push(booking._id);
      }
    }
  });

  if (pastUncompletedIds.length > 0) {
    // Non-blocking background update
    BookingModel.updateMany(
      { _id: { $in: pastUncompletedIds } },
      { $set: { status: "completed", isCompleted: true } }
    ).catch((err) => console.error("Error updating past bookings:", err));
  }

  return (
    <div>
      <MyBookings initialBookings={bookings} />
    </div>
  );
};

export default page;