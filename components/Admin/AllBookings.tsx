"use client";

import React from "react";
import { assets } from "@/assets/assets";
import { toast } from "react-toastify";
import { currency, slotDateFormat, isBookingCompleted } from "@/lib/utils";
import Image from "next/image";

interface AllBookingProps {
  bookings: any[];
}

const Allbooking = ({ bookings }: AllBookingProps) => {
  const cancelBooking = async (id: string) => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        window.location.reload();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  };

  return (
    <div className="w-full max-w-6xl p-4 sm:p-6 md:p-8 mx-auto space-y-4">
      {/* Title Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            All Bookings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            System-wide appointment overview
          </p>
        </div>
        {bookings && (
          <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100">
            {bookings.length} Total
          </span>
        )}
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        {/* Mobile & Tablet Card View (< sm) */}
        <div className="block sm:hidden divide-y divide-gray-100">
          {bookings && bookings.length > 0 ? (
            bookings.map((item, index) => {
              const completed = isBookingCompleted(item);
              return (
              <div key={item._id || index} className="p-4 space-y-3 bg-white">
                {/* Customer Info & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 overflow-hidden">
                      {item.userData?.image ? (
                        <Image
                          className="w-full h-full object-cover"
                          src={item.userData.image}
                          alt={item.userData?.name || "Customer"}
                          width={40}
                          height={40}
                        />
                      ) : (
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {item.userData?.name || "Guest User"}
                      </p>
                      {item.userData?.phone && (
                        <p className="text-xs text-gray-500 font-mono">
                          📱 {item.userData.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {item.cancelled ? (
                    <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                      Cancelled
                    </span>
                  ) : completed ? (
                    <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      Completed
                    </span>
                  ) : (
                    <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-100">
                      Active
                    </span>
                  )}
                </div>

                {/* Details Pill Box */}
                <div className="bg-gray-50/80 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="col-span-2 flex items-center gap-1.5 text-gray-700 font-medium border-b border-gray-200/60 pb-2">
                    <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{slotDateFormat(item.slotDate)}{item.slotTime ? `, ${item.slotTime}` : ""}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Image
                      className="w-5 h-5 rounded-full object-cover shrink-0"
                      src={item.shopData?.image || assets.upload_area}
                      alt=""
                      width={20}
                      height={20}
                    />
                    <span className="truncate">{item.shopData?.name}</span>
                  </div>

                  <div className="flex items-center justify-end font-bold text-gray-900 text-sm">
                    {currency}{item.amount}
                  </div>
                </div>

                {!item.cancelled && !completed && (
                  <button
                    onClick={() => cancelBooking(item._id)}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-medium py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Cancel Appointment</span>
                  </button>
                )}
              </div>
            );
          })
          ) : (
            <div className="p-8 text-center text-gray-400 text-sm font-medium">
              No bookings found
            </div>
          )}
        </div>

        {/* Desktop Table View (>= sm) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-xs text-gray-500 uppercase font-semibold">
              <tr>
                <th className="py-3.5 px-6">#</th>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-6">Date & Time</th>
                <th className="py-3.5 px-6">Shop</th>
                <th className="py-3.5 px-6">Fees</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings && bookings.length > 0 ? (
                bookings.map((item, index) => {
                  const completed = isBookingCompleted(item);
                  return (
                  <tr className="hover:bg-gray-50/80 transition-colors" key={item._id || index}>
                    <td className="py-4 px-6 font-medium text-gray-400">{index + 1}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Image
                          className="w-9 h-9 rounded-full object-cover border border-gray-200"
                          src={item.userData?.image || assets.upload_area}
                          alt=""
                          width={36}
                          height={36}
                        />
                        <span className="font-semibold text-gray-900">
                          {item.userData?.name || "Guest"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-800">
                      {slotDateFormat(item.slotDate)}{item.slotTime ? `, ${item.slotTime}` : ""}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Image
                          className="w-8 h-8 rounded-full object-cover bg-gray-100 border border-gray-200"
                          src={item.shopData?.image || assets.upload_area}
                          alt=""
                          width={32}
                          height={32}
                        />
                        <span className="font-medium text-gray-800">{item.shopData?.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-900">
                      {currency}{item.amount}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {item.cancelled ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                          Cancelled
                        </span>
                      ) : completed ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Completed
                        </span>
                      ) : (
                        <button
                          onClick={() => cancelBooking(item._id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-medium px-3 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1"
                          title="Cancel Booking"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span>Cancel</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 font-medium">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Allbooking;
