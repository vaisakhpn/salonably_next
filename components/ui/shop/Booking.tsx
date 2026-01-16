"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import slider_img from "@/assets/hero.png"; // Fallback image

interface BookingProps {
  shopData: any;
}

const Booking: React.FC<BookingProps> = ({ shopData }) => {
  const shopInfo = shopData;

  if (!shopInfo) {
    return <div className="text-center py-10">Shop not found</div>;
  }
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<null | {
    date: string;
    time: string;
  }>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("/api/bookings");
        if (res.status === 401) {
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
        }
      } catch (e) {
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  const handleBooking = async () => {
    if (!slotTime) {
      alert("Please select a time slot");
      return;
    }

    if (!isLoggedIn && (!guestName || !guestEmail)) {
      alert("Please enter your details to book as a guest");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId: shopInfo._id,
          slotDate: shopSlots[slotIndex].date,
          slotTime,
          shopData: shopInfo,
          amount: shopInfo.fees,
          guestDetails: !isLoggedIn
            ? { name: guestName, email: guestEmail }
            : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401 && isLoggedIn) {
          setIsLoggedIn(false);
          alert("Session expired. Please enter guest details or login.");
          setLoading(false);
          return;
        }
        throw new Error(data.message || "Booking failed");
      }

      setBookingDetails({
        date: shopSlots[slotIndex].date,
        time: slotTime,
      });

      if (!isLoggedIn) {
        alert(
          `Booking successful! An account has been created for you.\nEmail: ${guestEmail}\nPassword: ${guestName}123`
        );
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date:
          date.getDate() +
          " " +
          date.toLocaleString("default", { month: "short" }),
        day: date.toLocaleString("default", { weekday: "short" }).toUpperCase(),
        fullDate: date,
      });
    }
    return dates;
  };

  const shopSlots = generateDates().map((d) => ({
    ...d,
    times:
      shopInfo.availableSlots && shopInfo.availableSlots.length > 0
        ? shopInfo.availableSlots
        : [
            "10:00 AM",
            "11:00 AM",
            "12:00 PM",
            "01:00 PM",
            "02:00 PM",
            "03:00 PM",
            "04:00 PM",
            "05:00 PM",
          ],
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {!bookingDetails ? (
        <>
          <div className="flex flex-col sm:flex-row gap-6">
            <Image
              src={shopInfo.image || slider_img}
              alt="shop"
              width={300}
              height={300}
              className="rounded-lg object-cover"
            />

            <div className="flex-1 border rounded-lg p-6 bg-white">
              <h1 className="text-2xl font-semibold">{shopInfo.name}</h1>
              <p className="text-sm text-gray-600 mt-1">
                {shopInfo.address?.line1}, {shopInfo.address?.line2}
              </p>
              <p className="text-sm text-gray-600 mt-1">{shopInfo.phone}</p>
              <p className="text-sm text-gray-500 mt-4">{shopInfo.about}</p>
              <p className="mt-4 font-medium">
                Charge: <span className="text-gray-700">₹{shopInfo.fees}</span>
              </p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="font-medium text-gray-700 mb-4">Booking Slots</h2>

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

            <div className="flex gap-3 mt-6 overflow-x-auto">
              {shopSlots[slotIndex].times.map((time: string, index: number) => (
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

            {!isLoggedIn && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-medium mb-2">Guest Details</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="border px-4 py-2 rounded w-full outline-none focus:border-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="border px-4 py-2 rounded w-full outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500">
                    An account will be created for you automatically.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleBooking}
              disabled={loading}
              className="cursor-pointer bg-blue-500 text-white px-12 py-3 rounded-full mt-6 disabled:bg-blue-300 w-full sm:w-auto"
            >
              {loading ? "Booking..." : "Book the slot"}
            </button>
          </div>
        </>
      ) : (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md text-center">
            <h2 className="text-xl font-semibold text-blue-600">
              Booking Confirmed!
            </h2>
            <p className="mt-2 font-medium">{shopInfo.name}</p>
            <p className="text-sm text-gray-600 mt-1">
              {bookingDetails.date} | {bookingDetails.time}
            </p>
            <p className="text-sm text-gray-600 mt-1">₹{shopInfo.fees}</p>
            {!isLoggedIn && (
              <p className="text-sm text-gray-600 mt-2">
                Account created for: {guestName} ({guestEmail})
              </p>
            )}
            <div className="flex flex-col gap-2 mt-6">
              <button
                onClick={() => {
                  setBookingDetails(null);
                  router.push("/profile/my-bookings");
                }}
                className="cursor-pointer bg-blue-500 text-white px-6 py-2 rounded"
              >
                Go to My Bookings
              </button>
              <button
                onClick={() => setBookingDetails(null)}
                className="cursor-pointer bg-gray-300 px-6 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
