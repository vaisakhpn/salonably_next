"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Booking {
  _id: string;
  shopData: {
    name: string;
    address: {
      line1: string;
      line2: string;
    };
    image: string;
  };
  slotDate: string;
  slotTime: string;
  amount: number;
  status: string;
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings");
        if (res.ok) {
          const data = await res.json();
          setBookings(data.bookings);
        }
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading bookings...</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="p-8 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-xl font-medium mb-4">No bookings found</h2>
        <Link
          href="/"
          className="bg-blue-500 text-white px-6 py-2 rounded-full"
        >
          Find a Salon
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      <div className="flex flex-col gap-4">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="border rounded-lg p-4 flex flex-col sm:flex-row gap-4 shadow-sm bg-white"
          >
            <div className="flex-1">
              <h2 className="text-lg font-semibold">
                {booking.shopData?.name || "Salon"}
              </h2>
              <p className="text-gray-600 text-sm">
                {booking.shopData?.address?.line1}
              </p>
              <div className="mt-2 flex gap-4 text-sm font-medium">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                  {booking.slotDate}
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                  {booking.slotTime}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end justify-between">
              <span className="font-semibold text-lg">₹{booking.amount}</span>
              <span
                className={`px-3 py-1 rounded text-sm capitalize ${
                  booking.status === "booked"
                    ? "bg-green-100 text-green-800"
                    : booking.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100"
                }`}
              >
                {booking.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
