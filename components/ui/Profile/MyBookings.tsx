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

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        fetchBookings(); // Refresh list
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Failed to cancel booking");
    }
  };

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
            {/* Image */}
            <div className="w-full sm:w-32 h-32 relative shrink-0">
              <Image
                src={booking.shopData?.image || "/placeholder.png"}
                alt={booking.shopData?.name || "Shop"}
                fill
                className="object-cover rounded-lg"
              />
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  {booking.shopData?.name || "Salon"}
                </h2>
                <p className="text-gray-600 text-sm">
                  {booking.shopData?.address?.line1}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-sm font-medium">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded border border-blue-100">
                    {booking.slotDate}
                  </span>
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded border border-blue-100">
                    {booking.slotTime}
                  </span>
                </div>
              </div>

              {/* Status & Action - Mobile: Stacked, Desktop: Row */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t sm:border-t-0 pt-3 sm:pt-0">
                <span className="font-semibold text-lg">₹{booking.amount}</span>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded text-sm capitalize font-medium ${
                      booking.status === "booked"
                        ? "bg-blue-100 text-blue-800"
                        : booking.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {booking.status}
                  </span>

                  {booking.status === "booked" && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="text-sm border border-red-500 text-red-500 px-4 py-1.5 rounded hover:bg-red-50 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
