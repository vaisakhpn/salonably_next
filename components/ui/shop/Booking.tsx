"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { numberInputOnWheelPreventChange } from "@/lib/utils";
import { toast } from "@/lib/toast";

import slider_img from "@/assets/hero.png"; // Fallback image

interface BookingProps {
  shopData: any;
  initialOccupiedSlots: { date: string; time: string }[];
  isUserLoggedIn: boolean;
}

interface Slot {
  date: string;
  displayDate: string;
  day: string;
  fullDate: Date;
  times: string[];
}

const Booking: React.FC<BookingProps> = ({ shopData, initialOccupiedSlots, isUserLoggedIn }) => {
  const shopInfo = shopData;

  if (!shopInfo) {
    return <div className="text-center py-10">Shop not found</div>;
  }

  const [shopSlots, setShopSlots] = useState<Slot[]>([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<{ date: string; time: string } | null>(null);

  // Guest booking states
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn);

  // Controlled occupied slots array
  const [occupiedSlots, setOccupiedSlots] = useState<{ date: string; time: string }[]>(initialOccupiedSlots || []);

  const router = useRouter();

  // Helper: convert time string "10:30 AM" or "10:30" to minutes from midnight
  const convertTimeToMinutes = (timeStr: string): number => {
    if (!timeStr) return 0;
    const isPM = timeStr.toUpperCase().includes("PM");
    const isAM = timeStr.toUpperCase().includes("AM");
    const cleanTime = timeStr.replace(/(AM|PM|\s)/gi, "").trim();
    const parts = cleanTime.split(":");
    let hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;

    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  // Check if a time slot has already passed for TODAY
  const isSlotPast = (date: string, time: string) => {
    const today = new Date();
    const todayDateString = `${today.getDate()}_${today.getMonth() + 1}_${today.getFullYear()}`;

    if (date !== todayDateString) {
      return false; // Future dates are available
    }

    const currentMinutes = today.getHours() * 60 + today.getMinutes();
    const slotMinutes = convertTimeToMinutes(time);

    // Disable if current time + 15 minutes >= slot time
    return currentMinutes + 15 >= slotMinutes;
  };

  const isSlotOccupied = (date: string, time: string) => {
    return occupiedSlots.some(
      (slot) => slot.date === date && slot.time === time,
    );
  };

  useEffect(() => {
    const generateDates = () => {
      const dates = [];
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayNum = date.getDate();
        const monthNum = date.getMonth() + 1;
        const yearNum = date.getFullYear();
        dates.push({
          date: `${dayNum}_${monthNum}_${yearNum}`,
          displayDate: `${dayNum} ${date.toLocaleString("default", { month: "short" })}`,
          day: date
            .toLocaleString("default", { weekday: "short" })
            .toUpperCase(),
          fullDate: date,
        });
      }
      return dates;
    };

    const generatedSlots = generateDates().map((d) => {
      const rawTimes =
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
              "10:00 PM",
            ];

      const sortedTimes = [...rawTimes].sort(
        (a: string, b: string) =>
          convertTimeToMinutes(a) - convertTimeToMinutes(b),
      );

      return {
        ...d,
        times: sortedTimes,
      };
    });

    setShopSlots(generatedSlots);
  }, [shopInfo]);

  const handleBooking = async () => {
    if (!slotTime) {
      toast.warning("Please select a time slot");
      return;
    }

    if (isSlotOccupied(shopSlots[slotIndex].date, slotTime)) {
      toast.warning("This slot is already booked. Please choose another one.");
      return;
    }

    if (isSlotPast(shopSlots[slotIndex].date, slotTime)) {
      toast.warning("This slot is no longer available.");
      return;
    }

    if (!isLoggedIn && (!guestName || !guestPhone)) {
      toast.warning("Please enter both Name and Phone Number");
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
            ? { name: guestName, phone: guestPhone }
            : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401 && isLoggedIn) {
          setIsLoggedIn(false);
          toast.error("Session expired. Please enter guest details or login.");
          setLoading(false);
          return;
        }
        throw new Error(data.message || "Booking failed");
      }

      toast.success("Appointment booked successfully!");

      // Optimistically update occupied slots
      setOccupiedSlots((prev) => [
        ...prev,
        { date: shopSlots[slotIndex].date, time: slotTime },
      ]);

      setBookingDetails({
        date: shopSlots[slotIndex].date,
        time: slotTime,
      });

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
              priority
              className="rounded-lg object-cover"
            />

            <div className="flex-1 border rounded-lg p-6 bg-white">
              <h1 className="text-2xl font-semibold">{shopInfo.name}</h1>
              {shopInfo.ownerName && (
                <p className="text-sm font-medium text-gray-500 mt-1">
                  Owner: {shopInfo.ownerName}
                </p>
              )}
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

            <div className="flex gap-4 overflow-x-auto pb-4 p-2">
              {shopSlots.map((slot, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setSlotIndex(index);
                      setSlotTime("");
                    }}
                    className={`cursor-pointer min-w-[70px] text-center p-2.5 rounded-xl transition-all duration-200 ${
                      slotIndex === index
                        ? "bg-blue-600 text-white shadow-md scale-105"
                        : "bg-white border border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase">{slot.day}</p>
                    <p className="text-sm font-extrabold mt-0.5">
                      {slot.displayDate.split(" ")[0]}
                    </p>
                    <p className="text-[10px] font-medium opacity-80">
                      {slot.displayDate.split(" ")[1]}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 mt-6 overflow-x-auto">
              {shopSlots.length > 0 &&
                shopSlots[slotIndex] &&
                shopSlots[slotIndex].times.map(
                  (time: string, index: number) => {
                    const isOccupied = isSlotOccupied(
                      shopSlots[slotIndex].date,
                      time,
                    );
                    const isPast = isSlotPast(shopSlots[slotIndex].date, time);
                    const isDisabled = isOccupied || isPast;

                    return (
                      <button
                        key={index}
                        disabled={isDisabled}
                        onClick={() => !isDisabled && setSlotTime(time)}
                        className={`px-5 py-2 rounded-full text-sm transition-colors ${
                          isDisabled
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed border-none"
                            : slotTime === time
                              ? "bg-blue-500 text-white cursor-pointer"
                              : "border text-gray-500 hover:bg-gray-50 cursor-pointer"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  },
                )}
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
                    type="number"
                    placeholder="Phone Number"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="border px-4 py-2 rounded w-full outline-none focus:border-blue-500"
                    onWheel={numberInputOnWheelPreventChange}
                  />
                  <p className="text-xs text-gray-500">
                    Sign in to see your bookings and cancel them
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
            <p className="text-lg font-bold text-black mt-1">
              Screenshot This!
            </p>
            {!isLoggedIn && (
              <p className="text-sm text-gray-600 mt-2">
                Booking for: {guestName} ({guestPhone})
              </p>
            )}
            <div className="flex flex-col gap-2 mt-6">
              {isLoggedIn && (
                <button
                  onClick={() => {
                    setBookingDetails(null);
                    router.push("/profile/my-bookings");
                  }}
                  className="cursor-pointer bg-blue-500 text-white px-6 py-2 rounded"
                >
                  Go to My Bookings
                </button>
              )}
              <button
                onClick={() => {
                  setBookingDetails(null);
                  router.push("/");
                }}
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
