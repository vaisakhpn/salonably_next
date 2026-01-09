"use client";

import { useState } from "react";
import Image from "next/image";

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

import { shops } from "@/lib/data";
import slider_img from "../../../assets/hero.png"; // Fallback image

interface BookingProps {
  shopId: string;
}

const Booking: React.FC<BookingProps> = ({ shopId }) => {
  const shopInfo = shops.find((s) => s.id === shopId);

  if (!shopInfo) {
    return <div className="text-center py-10">Shop not found</div>;
  }
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [bookingDetails, setBookingDetails] = useState<null | {
    date: string;
    time: string;
  }>(null);

  // 🔹 Dummy slots (UI only)
  const shopSlots = [
    {
      date: "10 Jan",
      day: "MON",
      times: ["10:00 AM", "10:30 AM", "11:00 AM"],
    },
    {
      date: "11 Jan",
      day: "TUE",
      times: ["11:00 AM", "11:30 AM", "12:00 PM"],
    },
    {
      date: "12 Jan",
      day: "WED",
      times: ["01:00 PM", "01:30 PM", "02:00 PM"],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* ---------- Shop Details ---------- */}
      <div className="flex flex-col sm:flex-row gap-6">
        <Image
          src={slider_img}
          alt="shop"
          width={300}
          height={300}
          className="rounded-lg object-cover"
        />

        <div className="flex-1 border rounded-lg p-6 bg-white">
          <h1 className="text-2xl font-semibold">{shopInfo.name}</h1>

          <p className="text-sm text-gray-600 mt-1">
            {shopInfo.address.line1}, {shopInfo.address.line2}
          </p>

          <p className="text-sm text-gray-600 mt-1">{shopInfo.phone}</p>

          <p className="text-sm text-gray-500 mt-4">{shopInfo.about}</p>

          <p className="mt-4 font-medium">
            Charge: <span className="text-gray-700">₹{shopInfo.price}</span>
          </p>
        </div>
      </div>

      {/* ---------- Booking Slots ---------- */}
      <div className="mt-10">
        <h2 className="font-medium text-gray-700 mb-4">Booking Slots</h2>

        {/* Dates */}
        <div className="flex gap-4 overflow-x-auto">
          {shopSlots.map((slot, index) => (
            <div
              key={index}
              onClick={() => {
                setSlotIndex(index);
                setSlotTime("");
              }}
              className={`cursor-pointer min-w-[70px] text-center py-4 rounded-full ${
                slotIndex === index ? "bg-blue-500 text-white" : "border"
              }`}
            >
              <p>{slot.day}</p>
              <p>{slot.date}</p>
            </div>
          ))}
        </div>

        {/* Times */}
        <div className="flex gap-3 mt-6 overflow-x-auto">
          {shopSlots[slotIndex].times.map((time, index) => (
            <p
              key={index}
              onClick={() => setSlotTime(time)}
              className={`cursor-pointer px-5 py-2 rounded-full text-sm ${
                slotTime === time
                  ? "bg-blue-500 text-white"
                  : "border text-gray-500"
              }`}
            >
              {time}
            </p>
          ))}
        </div>

        {/* Guest Details */}
        <div className="mt-6">
          <h3 className="font-medium mb-2">Guest Details</h3>
          <input
            type="text"
            placeholder="Your Name"
            className="border px-4 py-2 rounded w-full mb-3"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Your Email"
            className="border px-4 py-2 rounded w-full"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
          />
        </div>

        <button
          onClick={() =>
            setBookingDetails({
              date: shopSlots[slotIndex].date,
              time: slotTime,
            })
          }
          className="bg-blue-500 text-white px-12 py-3 rounded-full mt-6"
        >
          Book the slot
        </button>
      </div>

      {/* ---------- Booking Modal ---------- */}
      {bookingDetails && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md text-center">
            <h2 className="text-xl font-semibold text-blue-600">
              Booking Confirmed!
            </h2>

            <p className="mt-2 font-medium">{shopInfo.name}</p>

            <p className="text-sm text-gray-600 mt-1">
              {bookingDetails.date} | {bookingDetails.time}
            </p>

            <p className="text-sm text-gray-600 mt-1">₹{shopInfo.price}</p>

            <p className="text-sm text-gray-600 mt-2">
              {guestName} ({guestEmail})
            </p>

            <button
              onClick={() => setBookingDetails(null)}
              className="mt-6 bg-gray-300 px-6 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
