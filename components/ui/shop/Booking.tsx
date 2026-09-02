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

const Booking: React.FC<BookingProps> = ({
  shopData,
  initialOccupiedSlots,
  isUserLoggedIn,
}) => {
  const shopInfo = shopData;

  const [shopSlots, setShopSlots] = useState<Slot[]>([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<{
    date: string;
    formattedDate: string;
    time: string;
  } | null>(null);

  // Guest booking states
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn);

  // Controlled occupied slots array
  const [occupiedSlots, setOccupiedSlots] = useState<
    { date: string; time: string }[]
  >(initialOccupiedSlots || []);

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
    if (!shopInfo) return;

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

  // Real-time live synchronization for occupied slots
  useEffect(() => {
    if (!shopInfo?._id) return;

    let isMounted = true;
    const fetchOccupied = async () => {
      try {
        const res = await fetch(
          `/api/bookings/occupied?shopId=${shopInfo._id}`,
        );
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data.occupiedSlots)) {
            setOccupiedSlots(data.occupiedSlots);
          }
        }
      } catch (err) {
        // Silently ignore network hiccup during background polling
      }
    };

    const interval = setInterval(fetchOccupied, 8000);
    window.addEventListener("focus", fetchOccupied);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener("focus", fetchOccupied);
    };
  }, [shopInfo?._id]);

  if (!shopInfo) {
    return <div className="text-center py-10">Shop not found</div>;
  }

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

      const currentSlot = shopSlots[slotIndex];
      const formattedDate = currentSlot
        ? `${currentSlot.day.charAt(0) + currentSlot.day.slice(1).toLowerCase()}, ${currentSlot.displayDate} ${currentSlot.fullDate.getFullYear()}`
        : `${new Date().toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}`;

      setBookingDetails({
        date: shopSlots[slotIndex].date,
        formattedDate,
        time: slotTime,
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
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
            {/* Header: Choose your arrival time */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  Choose your arrival time
                </h2>
                <div className="mt-1 text-sm text-gray-500 space-y-0.5">
                  <p>Your selected time is your arrival time.</p>
                  <p>You&apos;ll be next in line after the current service.</p>
                </div>
              </div>
              <div className="w-11 h-11 rounded-full border border-blue-100 bg-blue-50/60 flex items-center justify-center text-blue-600 shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
            </div>

            {/* Banner card: We'll take care of you next */}
            <div className="mt-6 bg-[#f0f6ff] border border-blue-100 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-blue-600 text-sm sm:text-base">
                    We&apos;ll take care of you next.
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm mt-0.5 max-w-sm">
                    If someone is being served when you arrive, you&apos;ll be
                    next as soon as they&apos;re done.
                  </p>
                </div>
              </div>

              {/* Graphic queue illustration */}
              <div className="flex items-center justify-center shrink-0 self-center md:self-auto">
                <svg
                  width="180"
                  height="68"
                  viewBox="0 0 180 68"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-40 sm:w-48 h-auto"
                >
                  {/* Dashed connector line */}
                  <path
                    d="M 28 32 Q 90 14 152 32"
                    stroke="#93C5FD"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    fill="none"
                  />

                  {/* Chair 1 (Left) */}
                  <g transform="translate(12, 16)">
                    <path
                      d="M 6 12 C 6 4 24 4 24 12 L 24 23 L 6 23 Z"
                      stroke="#2563EB"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="white"
                    />
                    <rect
                      x="2"
                      y="23"
                      width="26"
                      height="5"
                      rx="2.5"
                      stroke="#2563EB"
                      strokeWidth="1.75"
                      fill="white"
                    />
                    <line
                      x1="6"
                      y1="28"
                      x2="3"
                      y2="37"
                      stroke="#2563EB"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    />
                    <line
                      x1="24"
                      y1="28"
                      x2="27"
                      y2="37"
                      stroke="#2563EB"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    />
                  </g>

                  {/* Chair 2 (Middle - Active with User & Badge) */}
                  <g transform="translate(75, 16)">
                    <path
                      d="M 6 12 C 6 4 24 4 24 12 L 24 23 L 6 23 Z"
                      stroke="#16A34A"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="white"
                    />
                    <rect
                      x="2"
                      y="23"
                      width="26"
                      height="5"
                      rx="2.5"
                      stroke="#16A34A"
                      strokeWidth="1.75"
                      fill="white"
                    />
                    <line
                      x1="6"
                      y1="28"
                      x2="3"
                      y2="37"
                      stroke="#16A34A"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    />
                    <line
                      x1="24"
                      y1="28"
                      x2="27"
                      y2="37"
                      stroke="#16A34A"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    />

                    {/* Green Circle Person Avatar */}
                    <circle cx="15" cy="15" r="11" fill="#4ADE80" />
                    <circle
                      cx="15"
                      cy="11"
                      r="3"
                      stroke="white"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <path
                      d="M 10 20 C 10 16.5 12.2 15 15 15 C 17.8 15 20 16.5 20 20"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </g>

                  {/* Blue check badge on top of middle chair */}
                  <g transform="translate(83, 1)">
                    <circle cx="7" cy="7" r="7" fill="#2563EB" />
                    <path
                      d="M 4.5 7 L 6.5 9 L 10 4.5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>

                  {/* Chair 3 (Right) */}
                  <g transform="translate(138, 16)">
                    <path
                      d="M 6 12 C 6 4 24 4 24 12 L 24 23 L 6 23 Z"
                      stroke="#2563EB"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="white"
                    />
                    <rect
                      x="2"
                      y="23"
                      width="26"
                      height="5"
                      rx="2.5"
                      stroke="#2563EB"
                      strokeWidth="1.75"
                      fill="white"
                    />
                    <line
                      x1="6"
                      y1="28"
                      x2="3"
                      y2="37"
                      stroke="#2563EB"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    />
                    <line
                      x1="24"
                      y1="28"
                      x2="27"
                      y2="37"
                      stroke="#2563EB"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    />
                  </g>
                </svg>
              </div>
            </div>

            {/* Date Selector (Days row) */}
            <div className="flex gap-2.5 sm:gap-3.5 overflow-x-auto pb-2 pt-1 no-scrollbar mt-6">
              {shopSlots.map((slot, index) => {
                const isSelected = slotIndex === index;
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setSlotIndex(index);
                      setSlotTime("");
                    }}
                    className={`cursor-pointer min-w-[74px] sm:min-w-[82px] py-3.5 px-3 rounded-2xl text-center flex flex-col items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? "bg-[#1a6cf0] text-white shadow-md shadow-blue-500/25 scale-[1.02]"
                        : "bg-white border border-gray-200 text-gray-800 hover:border-blue-300 hover:bg-blue-50/20"
                    }`}
                  >
                    <span
                      className={`text-[11px] font-bold tracking-wider uppercase ${isSelected ? "text-white/90" : "text-gray-900"}`}
                    >
                      {slot.day}
                    </span>
                    <span
                      className={`text-xl sm:text-2xl font-black my-0.5 leading-none ${isSelected ? "text-white" : "text-gray-900"}`}
                    >
                      {slot.displayDate.split(" ")[0]}
                    </span>
                    <span
                      className={`text-[11px] font-medium ${isSelected ? "text-white/80" : "text-gray-500"}`}
                    >
                      {slot.displayDate.split(" ")[1]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Time Slot Rows (Vertical List) */}
            <div className="flex flex-col gap-3 mt-6">
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
                    const isSelected = slotTime === time;

                    return (
                      <div
                        key={index}
                        onClick={() => !isDisabled && setSlotTime(time)}
                        className={`w-full rounded-2xl border transition-all duration-200 px-3 sm:px-5 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4 ${
                          isDisabled
                            ? "bg-gray-50/80 border-gray-200 opacity-50 cursor-not-allowed"
                            : isSelected
                              ? "border-[#1a6cf0] bg-blue-50/20 shadow-xs ring-1 ring-[#1a6cf0] cursor-pointer"
                              : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50 cursor-pointer"
                        }`}
                      >
                        {/* Left: Clock icon & Time text */}
                        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                          <svg
                            className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${isSelected ? "text-[#1a6cf0]" : "text-gray-500"}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span
                            className={`text-xs sm:text-base md:text-lg font-bold ${isSelected ? "text-[#1a6cf0]" : "text-gray-900"}`}
                          >
                            {time}
                          </span>
                        </div>

                        {/* Center: You're next badge info */}
                        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs sm:text-sm font-semibold text-emerald-700 leading-snug whitespace-nowrap">
                              {isDisabled
                                ? isOccupied
                                  ? "Booked"
                                  : "Unavailable"
                                : "You're next"}
                            </span>
                            <span className="text-[10px] sm:text-xs text-gray-500 leading-tight whitespace-nowrap">
                              {isDisabled
                                ? isOccupied
                                  ? "Slot reserved"
                                  : "Time passed"
                                : "After current service"}
                            </span>
                          </div>
                        </div>

                        {/* Right: Radio Indicator */}
                        <div className="shrink-0">
                          {isSelected ? (
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#1a6cf0] flex items-center justify-center text-white shadow-xs">
                              <svg
                                className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-gray-300" />
                          )}
                        </div>
                      </div>
                    );
                  },
                )}
            </div>

            {/* Guest Details */}
            {!isLoggedIn && (
              <div className="mt-8">
                <h3 className="font-bold text-gray-900 text-base mb-3">
                  Guest Details
                </h3>
                <div className="space-y-3">
                  <div className="relative flex items-center border border-gray-200 rounded-2xl bg-white px-4 py-3.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                    <svg
                      className="w-5 h-5 text-gray-400 mr-3 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full text-sm sm:text-base text-gray-900 placeholder-gray-400 bg-transparent outline-none"
                    />
                  </div>

                  <div className="relative flex items-center border border-gray-200 rounded-2xl bg-white px-4 py-3.5 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                    <svg
                      className="w-5 h-5 text-gray-400 mr-3 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <input
                      type="number"
                      placeholder="Phone Number"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      onWheel={numberInputOnWheelPreventChange}
                      className="w-full text-sm sm:text-base text-gray-900 placeholder-gray-400 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-1 px-1">
                    <svg
                      className="w-3.5 h-3.5 text-gray-400 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    <span>
                      We&apos;ll send you booking updates and reminders on this
                      number
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Book the slot button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleBooking}
                disabled={loading}
                className="w-full sm:w-auto sm:min-w-55 bg-[#1a6cf0] hover:bg-blue-600 active:scale-[0.99] text-white font-semibold py-3.5 sm:py-3 px-6 sm:px-8 rounded-2xl flex items-center justify-center gap-3 text-sm sm:text-base shadow-md shadow-blue-500/20 transition-all duration-150 disabled:bg-blue-300 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>{loading ? "Booking..." : "Book the slot"}</span>
                <svg
                  className="w-5 h-5 text-white shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl p-5 sm:p-7 my-auto max-h-[95vh] overflow-y-auto no-scrollbar relative">
            {/* Success Animation & Header */}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-2 flex items-center justify-center">
                {/* Decorative Confetti elements */}
                <div className="absolute -top-2 -left-4 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <div className="absolute top-1 -left-7 w-1.5 h-3 rotate-45 bg-blue-500 rounded-xs" />
                <div className="absolute -top-3 left-7 w-2 h-2 rounded-full bg-purple-400" />
                <div className="absolute -top-1 -right-5 w-2 h-2 rotate-12 bg-pink-500 rounded-xs" />
                <div className="absolute top-2 -right-7 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <div className="absolute bottom-0 -right-4 w-2 h-2 bg-amber-500 rounded-full" />

                {/* Central Green Check Badge */}
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center shadow-xs">
                  <svg
                    className="w-9 h-9 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight mt-1">
                Booking Confirmed!
              </h2>
              <p className="text-gray-500 text-sm font-medium mt-1">
                We can&apos;t wait to see you.
              </p>
            </div>

            {/* "Your Booking" Details Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-xs mt-5">
              <h3 className="font-bold text-gray-900 text-base mb-3.5">
                Your Booking
              </h3>

              <div className="space-y-3">
                {/* Date */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2.5 text-gray-500">
                    <svg
                      className="w-4 h-4 text-emerald-600 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>Date</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {bookingDetails.formattedDate || bookingDetails.date}
                  </span>
                </div>

                <div className="border-t border-gray-100" />

                {/* Arrival Time */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2.5 text-gray-500">
                    <svg
                      className="w-4 h-4 text-emerald-600 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>Arrival Time</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {bookingDetails.time}
                  </span>
                </div>

                <div className="border-t border-gray-100" />

                {/* Service */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2.5 text-gray-500">
                    <svg
                      className="w-4 h-4 text-emerald-600 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="6" cy="6" r="3" />
                      <circle cx="6" cy="18" r="3" />
                      <line x1="20" y1="4" x2="8.12" y2="15.88" />
                      <line x1="14.47" y1="14.48" x2="20" y2="20" />
                      <line x1="8.12" y1="8.12" x2="12" y2="12" />
                    </svg>
                    <span>Service</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {shopInfo.service || "Haircut"}
                  </span>
                </div>

                <div className="border-t border-gray-100" />

                {/* Salon */}
                <div className="flex items-center justify-between text-sm gap-2">
                  <div className="flex items-center gap-2.5 text-gray-500 shrink-0">
                    <svg
                      className="w-4 h-4 text-emerald-600 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>Salon</span>
                  </div>
                  <span className="font-semibold text-gray-900 text-right truncate">
                    {shopInfo.name}
                    {shopInfo.address?.line2
                      ? `, ${shopInfo.address.line2}`
                      : ""}
                  </span>
                </div>

                <div className="border-t border-gray-100" />

                {/* Amount */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2.5 text-gray-500">
                    <svg
                      className="w-4 h-4 text-emerald-600 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                      <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                    <span>Amount</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    ₹{shopInfo.fees}
                  </span>
                </div>

                {!isLoggedIn && guestName && (
                  <>
                    <div className="border-t border-gray-100" />
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2.5 text-gray-500">
                        <svg
                          className="w-4 h-4 text-emerald-600 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                        </svg>
                        <span>Guest</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {guestName} ({guestPhone})
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* "You're next in line" Live Queue Card */}
            <div className="bg-[#f0fdf4] border border-emerald-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 mt-4">
              {/* Top info & queue illustration */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-emerald-800 text-sm sm:text-base">
                    You&apos;re next in line
                  </h4>
                  <p className="text-gray-600 text-xs mt-0.5 max-w-[200px] sm:max-w-xs leading-tight">
                    After the current service is completed, we&apos;ll take care
                    of you.
                  </p>
                </div>

                {/* Star Chairs Graphic */}
                <div className="shrink-0">
                  <svg
                    width="110"
                    height="42"
                    viewBox="0 0 110 42"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-20 sm:w-24 h-auto"
                  >
                    <path
                      d="M 18 20 Q 55 6 92 20"
                      stroke="#93C5FD"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                      fill="none"
                    />
                    {/* Chair Left */}
                    <g transform="translate(6, 8)">
                      <path
                        d="M 4 8 C 4 3 16 3 16 8 L 16 15 L 4 15 Z"
                        stroke="#93C5FD"
                        strokeWidth="1.5"
                        fill="white"
                      />
                      <rect
                        x="1"
                        y="15"
                        width="18"
                        height="3"
                        rx="1.5"
                        stroke="#93C5FD"
                        strokeWidth="1.5"
                        fill="white"
                      />
                      <line
                        x1="4"
                        y1="18"
                        x2="2"
                        y2="24"
                        stroke="#93C5FD"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <line
                        x1="16"
                        y1="18"
                        x2="18"
                        y2="24"
                        stroke="#93C5FD"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </g>
                    {/* Chair Middle */}
                    <g transform="translate(45, 8)">
                      <path
                        d="M 4 8 C 4 3 16 3 16 8 L 16 15 L 4 15 Z"
                        stroke="#16A34A"
                        strokeWidth="1.5"
                        fill="white"
                      />
                      <rect
                        x="1"
                        y="15"
                        width="18"
                        height="3"
                        rx="1.5"
                        stroke="#16A34A"
                        strokeWidth="1.5"
                        fill="white"
                      />
                      <line
                        x1="4"
                        y1="18"
                        x2="2"
                        y2="24"
                        stroke="#16A34A"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <line
                        x1="16"
                        y1="18"
                        x2="18"
                        y2="24"
                        stroke="#16A34A"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <circle cx="10" cy="9.5" r="6" fill="#22C55E" />
                      <circle
                        cx="10"
                        cy="7.5"
                        r="1.8"
                        stroke="white"
                        strokeWidth="1"
                        fill="none"
                      />
                      <path
                        d="M 7 13 C 7 11.2 8.5 10.5 10 10.5 C 11.5 10.5 13 11.2 13 13"
                        stroke="white"
                        strokeWidth="1"
                        strokeLinecap="round"
                        fill="none"
                      />
                    </g>
                    {/* Star above middle chair */}
                    <g transform="translate(50, 0)">
                      <path
                        d="M 5 0 L 6.2 3.5 L 9.8 3.5 L 6.9 5.6 L 8 9 L 5 6.9 L 2 9 L 3.1 5.6 L 0.2 3.5 L 3.8 3.5 Z"
                        fill="#3B82F6"
                      />
                    </g>
                    {/* Chair Right */}
                    <g transform="translate(84, 8)">
                      <path
                        d="M 4 8 C 4 3 16 3 16 8 L 16 15 L 4 15 Z"
                        stroke="#93C5FD"
                        strokeWidth="1.5"
                        fill="white"
                      />
                      <rect
                        x="1"
                        y="15"
                        width="18"
                        height="3"
                        rx="1.5"
                        stroke="#93C5FD"
                        strokeWidth="1.5"
                        fill="white"
                      />
                      <line
                        x1="4"
                        y1="18"
                        x2="2"
                        y2="24"
                        stroke="#93C5FD"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <line
                        x1="16"
                        y1="18"
                        x2="18"
                        y2="24"
                        stroke="#93C5FD"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </g>
                  </svg>
                </div>
              </div>

              <div className="border-t border-emerald-200/60 my-3.5" />

              {/* Live Queue Visual: Customer Ahead -> You */}
              <div className="flex items-center justify-between px-2 sm:px-6">
                {/* Left: Customer Ahead */}
                <div className="flex flex-col items-center text-center">
                  <span className="text-[11px] font-medium text-gray-500 mb-1.5">
                    Currently serving
                  </span>
                  <div className="relative">
                    <div className="w-13 h-13 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden">
                      <svg
                        className="w-9 h-9 text-slate-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    {/* Scissors icon badge */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-gray-200 shadow-xs flex items-center justify-center text-slate-700">
                      <svg
                        className="w-3 h-3 text-slate-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="6" cy="6" r="3" />
                        <circle cx="6" cy="18" r="3" />
                        <line x1="20" y1="4" x2="8.12" y2="15.88" />
                      </svg>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-gray-900 mt-2">
                    Customer ahead
                  </span>
                  <span className="text-[10px] text-gray-500">
                    Haircut in progress
                  </span>
                </div>

                {/* Connecting arrow */}
                <div className="flex items-center justify-center flex-1 px-2">
                  <div className="w-full flex items-center justify-center relative">
                    <div className="w-full border-t-2 border-dashed border-emerald-300" />
                    <svg
                      className="w-4 h-4 text-emerald-600 shrink-0 absolute right-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                  </div>
                </div>

                {/* Right: You */}
                <div className="flex flex-col items-center text-center">
                  <span className="text-[11px] font-bold text-emerald-600 mb-1.5">
                    You
                  </span>
                  <div className="relative">
                    <div className="w-13 h-13 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center overflow-hidden ring-4 ring-emerald-100">
                      <svg
                        className="w-9 h-9 text-emerald-600"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-emerald-700 mt-2">
                    You&apos;re next
                  </span>
                  <span className="text-[10px] text-gray-500">
                    We&apos;ll take you next
                  </span>
                </div>
              </div>
            </div>

            {/* Arrival Reminder Banner */}
            <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 mt-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-gray-900">
                    Please arrive around {bookingDetails.time}
                  </h5>
                  <p className="text-gray-600 text-[11px] leading-tight mt-0.5">
                    If someone is being served when you arrive, you&apos;ll be
                    next in line.
                  </p>
                </div>
              </div>

              {/* Storefront Icon */}
              <svg
                width="54"
                height="42"
                viewBox="0 0 64 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 sm:w-14 h-auto shrink-0 hidden sm:block"
              >
                <path
                  d="M 32 4 C 29 4 27 6 27 9 C 27 13 32 17 32 17 C 32 17 37 13 37 9 C 37 6 35 4 32 4 Z"
                  fill="#22C55E"
                />
                <circle cx="32" cy="8.5" r="1.5" fill="white" />
                <path d="M 12 22 L 52 22 L 48 26 L 16 26 Z" fill="#3B82F6" />
                <rect
                  x="15"
                  y="26"
                  width="34"
                  height="18"
                  rx="1"
                  fill="#DBEAFE"
                  stroke="#93C5FD"
                  strokeWidth="1"
                />
                <rect x="19" y="32" width="10" height="12" fill="#60A5FA" />
                <rect
                  x="35"
                  y="32"
                  width="10"
                  height="7"
                  fill="white"
                  stroke="#60A5FA"
                  strokeWidth="1"
                />
                <line
                  x1="8"
                  y1="44"
                  x2="56"
                  y2="44"
                  stroke="#CBD5E1"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* SCREENSHOT THIS CALLOUT BANNER */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-2xl p-4 shadow-md flex items-center gap-3.5 mt-5">
              <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 text-xl">
                📸
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base tracking-tight leading-tight">
                  Screenshot This Page!
                </h4>
                <p className="text-[11px] sm:text-xs text-amber-50 leading-tight mt-0.5">
                  Please capture or save this confirmation screen to present at
                  the salon counter.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 mt-5">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      setBookingDetails(null);
                      router.push("/profile/my-bookings");
                    }}
                    className="w-full bg-[#1a6cf0] hover:bg-blue-600 active:scale-[0.99] text-white font-semibold py-3.5 px-6 rounded-2xl text-sm sm:text-base shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>View My Bookings</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      setBookingDetails(null);
                      router.push("/");
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-2xl text-sm transition-all cursor-pointer"
                  >
                    Done / Back to Home
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setBookingDetails(null);
                    router.push("/");
                  }}
                  className="w-full bg-[#1a6cf0] hover:bg-blue-600 active:scale-[0.99] text-white font-semibold py-3.5 px-6 rounded-2xl text-sm sm:text-base shadow-sm transition-all cursor-pointer"
                >
                  Done / Back to Home
                </button>
              )}
            </div>

            {/* Need to make changes footer */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-4 h-4 text-gray-400 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>
                  Need to make changes? Contact the salon or cancel from
                  profile.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
