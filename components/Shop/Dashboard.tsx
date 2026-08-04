"use client";

import React from "react";
import { assets } from "@/assets/assets";
import { toast } from "@/lib/toast";
import { slotDateFormat, isBookingCompleted } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface ShopData {
  name: string;
  image: string;
}

interface UserData {
  name: string;
  image?: string;
  phone?: string;
}

interface Booking {
  _id: string;
  shopData: ShopData;
  userData: UserData;
  slotDate: string;
  slotTime?: string;
  cancelled: boolean;
  isCompleted: boolean;
}

interface DashboardData {
  shopName?: string;
  bookings: number;
  customers: number;
  latestBookings: Booking[];
}

interface DashboardProps {
  dashData: DashboardData;
}

const Dashboard: React.FC<DashboardProps> = ({ dashData }) => {
  const router = useRouter();

  const cancelBooking = async (id: string) => {
    try {
      const res = await fetch("/api/shop/cancel-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        router.refresh();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  };

  if (!dashData) return null;

  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning,";
    if (hour < 17) return "Good afternoon,";
    return "Good evening,";
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-5">
      {/* Greeting Banner (Matches UI Design) */}
      <div className="relative bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-purple-50/60 border border-blue-100/60 rounded-3xl p-5 sm:p-7 overflow-hidden shadow-xs flex justify-between items-center">
        <div className="z-10 space-y-1">
          <p className="text-sm font-medium text-gray-500">{getGreetingTime()}</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <span>{dashData.shopName || "Vaisakh"}</span>
            <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-normal">
            Here’s what’s happening today.
          </p>
        </div>

        {/* Decorative Calendar Graphic */}
        <div className="relative flex items-center justify-center min-w-[90px] h-20 sm:h-24">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-500/10 rounded-2xl rotate-6 absolute" />
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-600 rounded-2xl flex flex-col justify-center items-center shadow-md text-white z-10 p-2 relative">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {/* Clock Overlay Badge */}
            <div className="absolute -bottom-2 -right-2 bg-blue-600 border-2 border-white text-white p-1 rounded-full shadow-xs">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Stats Grid (2-columns on mobile matching design) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        {/* Bookings Card */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs border-b-2 border-b-blue-500 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{dashData.bookings}</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Bookings</p>
            <p className="text-[11px] text-gray-400">Total bookings</p>
          </div>
        </div>

        {/* Customers Card */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs border-b-2 border-b-emerald-500 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{dashData.customers}</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Customers</p>
            <p className="text-[11px] text-gray-400">Total customers</p>
          </div>
        </div>
      </div>

      {/* Quick Link Card - All Bookings */}
      <Link
        href="/shop-owner/shop-booking"
        className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
      >
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
              All Bookings
            </h3>
            <p className="text-xs text-gray-500">View and manage all your bookings</p>
          </div>
        </div>
        <svg className="w-5 h-5 text-indigo-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>

      {/* Latest Bookings Section */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="font-bold text-gray-800 text-sm">Latest Bookings</h2>
          </div>
          <Link
            href="/shop-owner/shop-booking"
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-0.5"
          >
            <span>View all</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {[...dashData.latestBookings].reverse().map((item) => {
            const completed = isBookingCompleted(item);
            return (
            <div
              className="flex items-center px-5 py-3.5 gap-3.5 hover:bg-gray-50/80 transition-colors"
              key={item._id}
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 overflow-hidden">
                {item.userData?.image ? (
                  <Image
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    src={item.userData.image}
                    alt={item.userData?.name || "Customer"}
                  />
                ) : (
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-semibold text-sm truncate">
                  {item.userData?.name || "Vaisakh"}
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
                      Pending
                    </span>
                    <button
                      onClick={() => cancelBooking(item._id)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                      title="Cancel Booking"
                    >
                      <Image
                        width={20}
                        height={20}
                        className="w-4 h-4"
                        src={assets.cancel_icon}
                        alt="Cancel"
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

          {dashData.latestBookings.length === 0 && (
            <div className="p-8 text-center text-gray-400 text-xs font-medium">
              No bookings found.
            </div>
          )}
        </div>
      </div>

      {/* Business Overview Card (Matches UI Design) */}
      <div className="bg-gradient-to-br from-indigo-50/40 via-purple-50/20 to-blue-50/30 rounded-2xl border border-indigo-100/50 p-5 relative overflow-hidden shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-purple-100/80 text-purple-700 rounded-xl">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            <span>↑ 12.5%</span>
            <span className="text-[10px] font-normal text-gray-500">vs last 7 days</span>
          </span>
        </div>

        <h3 className="font-bold text-gray-900 text-sm">Business Overview</h3>
        <p className="text-xs text-gray-500 mt-0.5 max-w-xs leading-relaxed">
          Track your performance and see how your business is growing.
        </p>

        <div className="mt-4 flex items-center justify-between">
          <Link
            href="/shop-owner/shop-profile"
            className="inline-block bg-indigo-100/80 hover:bg-indigo-200 text-indigo-700 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            View Insights
          </Link>

          {/* SVG Wave Line Chart Graphic */}
          <div className="w-28 sm:w-36 h-12 opacity-80">
            <svg viewBox="0 0 120 40" className="w-full h-full text-indigo-500 fill-none stroke-current stroke-2">
              <path d="M0 30 Q 30 10, 60 25 T 120 5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Recent Activity Section (Matches UI Design) */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="font-bold text-gray-800 text-sm">Recent Activity</h2>
          </div>
          <span className="text-xs font-semibold text-blue-600 cursor-pointer hover:underline">
            View all &gt;
          </span>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-start gap-3 p-2.5 bg-gray-50/60 rounded-xl border border-gray-100">
            <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-full mt-0.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-900">New booking received</p>
                <span className="text-[10px] text-gray-400">Today</span>
              </div>
              <p className="text-xs text-gray-500">
                Customer booked appointment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
