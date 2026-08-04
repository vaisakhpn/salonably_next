"use client";

import React from "react";
import { assets } from "@/assets/assets";
import { toast } from "@/lib/toast";
import { slotDateFormat, isBookingCompleted } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface DashboardProps {
  dashData: {
    shops: number;
    bookings: number;
    customers: number;
    latestBookings: any[];
  };
}

const Dashboard = ({ dashData }: DashboardProps) => {
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

  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning,";
    if (hour < 17) return "Good afternoon,";
    return "Good evening,";
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-5">
      {/* Greeting Banner */}
      <div className="relative bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-purple-50/60 border border-blue-100/60 rounded-3xl p-5 sm:p-7 overflow-hidden shadow-xs flex justify-between items-center">
        <div className="z-10 space-y-1">
          <p className="text-sm font-medium text-gray-500">{getGreetingTime()}</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <span>Admin Control Panel</span>
            <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-normal">
            System-wide statistics and shop performance overview.
          </p>
        </div>

        {/* Decorative Graphic */}
        <div className="relative flex items-center justify-center min-w-[90px] h-20 sm:h-24">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-500/10 rounded-2xl rotate-6 absolute" />
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-600 rounded-2xl flex flex-col justify-center items-center shadow-md text-white z-10 p-2 relative">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <div className="absolute -bottom-2 -right-2 bg-blue-600 border-2 border-white text-white p-1 rounded-full shadow-xs">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Stats Grid (3-column responsive) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
        {/* Shops Card */}
        <Link
          href="/admin/shop-list"
          className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs border-b-2 border-b-purple-500 flex items-center gap-3 hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0H9m4 0h2" />
            </svg>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
              {dashData.shops}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Registered Shops</p>
            <p className="text-[11px] text-gray-400">Active vendors</p>
          </div>
        </Link>

        {/* Bookings Card */}
        <Link
          href="/admin/bookings"
          className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs border-b-2 border-b-blue-500 flex items-center gap-3 hover:shadow-md transition-all group cursor-pointer"
        >
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {dashData.bookings}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Total Bookings</p>
            <p className="text-[11px] text-gray-400">System appointments</p>
          </div>
        </Link>

        {/* Customers Card */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs border-b-2 border-b-emerald-500 flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{dashData.customers}</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Total Customers</p>
            <p className="text-[11px] text-gray-400">Unique app users</p>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/admin/add-shop"
          className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                Add New Shop
              </h3>
              <p className="text-xs text-gray-500">Register a new vendor on LockMyTime</p>
            </div>
          </div>
          <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        <Link
          href="/admin/shop-list"
          className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm group-hover:text-purple-600 transition-colors">
                Manage Shops
              </h3>
              <p className="text-xs text-gray-500">Toggle availability and edit shops</p>
            </div>
          </div>
          <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Latest Bookings Section */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="font-bold text-gray-800 text-sm">Latest System Bookings</h2>
          </div>
          <Link
            href="/admin/bookings"
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-0.5"
          >
            <span>View all</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {dashData.latestBookings && dashData.latestBookings.length > 0 ? (
            dashData.latestBookings.map((item, index) => {
              const completed = isBookingCompleted(item);
              return (
                <div
                  className="flex items-center px-5 py-3.5 gap-3.5 hover:bg-gray-50/80 transition-colors"
                  key={item._id || index}
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.shopData?.image ? (
                      <Image
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        src={item.shopData.image}
                        alt={item.shopData?.name || "Shop"}
                      />
                    ) : (
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0H9m4 0h2" />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-semibold text-sm truncate">
                      {item.shopData?.name || "Shop"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {slotDateFormat(item.slotDate)} {item.slotTime ? `• ${item.slotTime}` : ""}
                    </p>
                  </div>

                  <div className="shrink-0">
                    {item.cancelled ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                        Cancelled
                      </span>
                    ) : completed ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Completed
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                          Active
                        </span>
                        <button
                          onClick={() => cancelBooking(item._id)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                          title="Cancel Booking"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-400 text-xs font-medium">
              No bookings found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
