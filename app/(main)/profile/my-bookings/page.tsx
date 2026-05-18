import MyBookings from '@/components/ui/Profile/MyBookings'
import React from 'react'
import dbConnect from '@/server/db/mongodb'
import BookingModel from '@/server/models/Booking'
import { getUser } from '@/server/middleware/auth'
import { redirect } from 'next/navigation'

const page = async () => {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }

  await dbConnect();

  let bookings = await BookingModel.find({ userId: user._id }).sort({
    createdAt: -1,
  });

  const now = new Date();
  const currentYear = now.getFullYear();
  const updates = [];

  for (const booking of bookings) {
    if (booking.status === "booked") {
      try {
        const dateString = `${booking.slotDate} ${currentYear} ${booking.slotTime}`;
        const bookingDateTime = new Date(dateString);

        if (bookingDateTime < now) {
          booking.status = "completed";
          booking.isCompleted = true;
          updates.push(booking.save());
        }
      } catch (e) {
        console.error("Error parsing date for booking:", booking._id, e);
      }
    }
  }

  if (updates.length > 0) {
    await Promise.all(updates);
  }

  // Serialize to pass to Client Component
  const serializedBookings = JSON.parse(JSON.stringify(bookings));

  return (
    <div><MyBookings initialBookings={serializedBookings} /></div>
  )
}

export default page