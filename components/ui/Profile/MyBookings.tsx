"use client";

import { useState } from "react";
import Image from "next/image";
import slider_img from "../../../assets/hero.png";

type Booking = {
  id: string;
  slotDate: string;
  slotTime: string;
  cancelled: boolean;
  isCompleted: boolean;
  shopData: {
    name: string;
    image: string | any;
    address: {
      line1: string;
      line2: string;
    };
  };
};

const months = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const slotDateFormat = (slotDate: string) => {
  const dateArray = slotDate.split("_");
  return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
};

// 🔹 Dummy bookings data (UI only)
const initialBookings: Booking[] = [
  {
    id: "1",
    slotDate: "10_1_2026",
    slotTime: "10:30 AM",
    cancelled: false,
    isCompleted: false,
    shopData: {
      name: "Style Studio",
      image: slider_img,
      address: {
        line1: "MG Road",
        line2: "Kochi",
      },
    },
  },
  {
    id: "2",
    slotDate: "05_1_2026",
    slotTime: "01:00 PM",
    cancelled: true,
    isCompleted: false,
    shopData: {
      name: "Urban Cuts",
      image: slider_img,
      address: {
        line1: "Kaloor",
        line2: "Kochi",
      },
    },
  },
  {
    id: "3",
    slotDate: "01_1_2026",
    slotTime: "11:00 AM",
    cancelled: false,
    isCompleted: true,
    shopData: {
      name: "Elite Saloon",
      image: slider_img,
      address: {
        line1: "Edappally",
        line2: "Kochi",
      },
    },
  },
];

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const cancelBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === id
          ? { ...booking, cancelled: true }
          : booking
      )
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Bookings
      </p>

      <div>
        {bookings.slice(0, 5).map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b"
          >
            {/* Shop Image */}
            <div>
              <Image
                src={item.shopData.image}
                alt="shop"
                width={130}
                height={100}
                className="bg-indigo-50 rounded"
              />
            </div>

            {/* Booking Details */}
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {item.shopData.name}
              </p>

              <p className="text-zinc-700 font-medium mt-1">
                Address:
              </p>
              <p className="text-xs">{item.shopData.address.line1}</p>
              <p className="text-xs">{item.shopData.address.line2}</p>

              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time :
                </span>{" "}
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 justify-end">
              {!item.cancelled && !item.isCompleted && (
                <button
                  disabled
                  className="text-sm text-stone-500 sm:min-w-48 py-2 border disabled:bg-gray-200 disabled:text-gray-400"
                >
                  Pay Online
                </button>
              )}

              {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => cancelBooking(item.id)}
                  className="text-sm text-stone-500 sm:min-w-48 py-2 border hover:bg-red-500 hover:text-white transition"
                >
                  Cancel Booking
                </button>
              )}

              {item.cancelled && !item.isCompleted && (
                <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                  Booking Cancelled
                </button>
              )}

              {item.isCompleted && (
                <button
                  disabled
                  className="text-green-500 sm:min-w-48 py-2 border border-green-500 rounded"
                >
                  Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
