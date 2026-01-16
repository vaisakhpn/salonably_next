"use client";

import React from "react";
import { assets } from "@/assets/assets";
import { toast } from "react-toastify";
import { currency, slotDateFormat } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ShopData {
  name: string;
  image: string;
}

interface Booking {
  _id: string;
  shopData: ShopData;
  slotDate: string;
  cancelled: boolean;
  isCompleted: boolean;
}

interface DashboardData {
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

  return (
    <div className="m-5">
      {/* Stats Cards */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-4 bg-white p-6 min-w-52 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all">
          <div className="p-3 bg-blue-50 rounded-full">
            <Image
              width={40}
              height={40}
              
              src={assets.appointments_icon}
              alt=""
            />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {dashData.bookings}
            </p>
            <p className="text-gray-500 text-sm font-medium">Bookings</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-6 min-w-52 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all">
          <div className="p-3 bg-green-50 rounded-full">
            <Image
              width={40}
              height={40}
              
              src={assets.customers_icon}
              alt=""
            />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {dashData.customers}
            </p>
            <p className="text-gray-500 text-sm font-medium">Customers</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <Image
            width={20}
            height={20}
           
            src={assets.list_icon}
            alt=""
          />
          <p className="font-semibold text-gray-700">Latest Bookings</p>
        </div>

        <div className="divide-y divide-gray-100">
          {dashData.latestBookings.map((item) => (
            <div
              className="flex items-center px-6 py-4 gap-4 hover:bg-gray-50 transition-colors"
              key={item._id}
            >
              <Image
                width={100}
                height={100}
                className="rounded-full w-10 h-10 object-cover border border-gray-200"
                src={item.shopData.image}
                alt={item.shopData.name}
              />
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-medium truncate">
                  {item.shopData.name}
                </p>
                <p className="text-gray-500 text-sm">
                  {slotDateFormat(item.slotDate)}
                </p>
              </div>

              <div className="flex-shrink-0">
                {item.cancelled ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Cancelled
                  </span>
                ) : item.isCompleted ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Completed
                  </span>
                ) : (
                  <button
                    onClick={() => cancelBooking(item._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    title="Cancel Booking"
                  >
                    <Image
                      width={100}
                      height={100}
                      className="w-5 h-5"
                      src={assets.cancel_icon}
                      alt=""
                    />
                  </button>
                )}
              </div>
            </div>
          ))}
          {dashData.latestBookings.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No bookings found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
