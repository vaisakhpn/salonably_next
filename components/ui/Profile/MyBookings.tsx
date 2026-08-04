"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";

interface Booking {
  _id: string;
  shopId?: string;
  shopData: {
    _id?: string;
    name: string;
    address: {
      line1: string;
      line2?: string;
    };
    image: string;
  };
  slotDate: string;
  slotTime: string;
  amount: number;
  status?: string;
  isCompleted?: boolean;
}

const MyBookings = ({ initialBookings = [] }: { initialBookings: Booking[] }) => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [activeFilter, setActiveFilter] = useState<"all" | "confirmed" | "cancelled">("all");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const router = useRouter();

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setCancellingId(bookingId);
    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Booking cancelled successfully");
        setBookings(bookings.map((b) => (b._id === bookingId ? { ...b, status: "cancelled" } : b)));
        router.refresh();
      } else {
        toast.error(data.message || "Failed to cancel booking");
      }
    } catch (error) {
      toast.error("Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeFilter === "all") return true;
    return b.status === activeFilter;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-2">
            <span>📅</span>
            <span>Appointment History</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            My Bookings
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1">
            Manage your salon appointments and view booking status
          </p>
        </div>

        {/* Stats Pill */}
        <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center shrink-0">
          <p className="text-xl font-extrabold text-white">{bookings.length}</p>
          <p className="text-[11px] text-blue-100 font-medium">Total Bookings</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-gray-100">
        {[
          { id: "all", label: "All Bookings", count: bookings.length },
          { id: "booked", label: "Upcoming", count: bookings.filter((b) => b.status === "booked").length },
          { id: "completed", label: "Completed", count: bookings.filter((b) => b.status === "completed").length },
          { id: "cancelled", label: "Cancelled", count: bookings.filter((b) => b.status === "cancelled").length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeFilter === tab.id
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeFilter === tab.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-gray-100 shadow-2xs space-y-4 max-w-md mx-auto my-8">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-gray-900 text-lg">No bookings found</h3>
            <p className="text-xs text-gray-500">
              {activeFilter === "all"
                ? "You haven't made any salon appointments yet."
                : `You have no ${activeFilter} bookings.`}
            </p>
          </div>
          <Link href="/shops" className="inline-block pt-2">
            <button className="bg-blue-600 text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-md hover:bg-blue-700 active:scale-95 transition-all cursor-pointer">
              Explore Salons & Book →
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const isUpcoming = booking.status === "booked";
            const isCompleted = booking.status === "completed";
            const isCancelled = booking.status === "cancelled";

            return (
              <div
                key={booking._id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-2xs hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                {/* Shop Image */}
                <div className="relative w-full sm:w-36 h-36 sm:h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                  <Image
                    src={booking.shopData?.image || "https://cdn3.iconfinder.com/data/icons/essential-rounded/64/Rounded-31-512.png"}
                    alt={booking.shopData?.name || "Salon"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow-2xs backdrop-blur-md flex items-center gap-1 ${
                        isUpcoming
                          ? "bg-blue-600/90 text-white"
                          : isCompleted
                          ? "bg-emerald-600/90 text-white"
                          : "bg-red-600/90 text-white"
                      }`}
                    >
                      {isUpcoming && "📅 Upcoming"}
                      {isCompleted && "✓ Completed"}
                      {isCancelled && "✕ Cancelled"}
                    </span>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="flex-1 min-w-0 space-y-2 w-full">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-extrabold text-gray-900 text-base sm:text-lg truncate">
                        {booking.shopData?.name || "Salon Appointment"}
                      </h2>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                        <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span>{booking.shopData?.address?.line1 || "Location Near You"}</span>
                      </p>
                    </div>

                    <span className="font-extrabold text-gray-900 text-base sm:text-lg shrink-0">
                      ₹{booking.amount}
                    </span>
                  </div>

                  {/* Slot Date & Time Badges */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
                      <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Date: {booking.slotDate.replaceAll("_", "/")}</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                      <svg className="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Time: {booking.slotTime}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
                    <span className="text-[11px] text-gray-400 font-medium">
                      Booking ID: #{booking._id.slice(-6)}
                    </span>

                    <div className="flex items-center gap-2">
                      {isUpcoming && (
                        <button
                          disabled={cancellingId === booking._id}
                          onClick={() => handleCancel(booking._id)}
                          className="text-xs font-bold text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 px-4 py-1.5 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {cancellingId === booking._id ? "Cancelling..." : "Cancel Appointment"}
                        </button>
                      )}

                      {booking.shopId && (
                        <Link href={`/shops/${booking.shopId}`}>
                          <button className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-1.5 rounded-full transition-colors cursor-pointer">
                            View Salon →
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
