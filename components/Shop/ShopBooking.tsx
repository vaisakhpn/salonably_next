"use client";

import { assets } from "@/assets/assets";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { currency, slotDateFormat } from "@/lib/utils";
import Image from "next/image";

interface ShopBookingProps {
  bookings: any[];
}

const ShopBooking = ({ bookings }: ShopBookingProps) => {
  const router = useRouter();

  const handleBookingAction = async (
    id: string,
    action: "cancel" | "complete"
  ) => {
    try {
      const endpoint =
        action === "cancel"
          ? "/api/shop/cancel-appointment"
          : "/api/shop/complete-appointment";

      const res = await fetch(endpoint, {
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
      toast.error("Failed to update booking");
    }
  };

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Bookings</p>
      <div className="bg-white border rounded text-sm  max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 gap-1 border-b">
          <p>#</p>
          <p>Customer</p>
          <p>Date & Time</p>
          <p>Shop</p>
          <p>Fees</p>
          <p>Action</p>
        </div>
        {bookings && bookings.length > 0 ? (
          bookings.map((item, index) => (
            <div
              className="flex flex-wrap justify-between max-sm:gap-5 sm:grid sm:grid-cols-[0.5fr_3fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
              key={index}
            >
              <p className="max-sm:hidden">{index + 1}</p>
              <div className="flex items-center gap-2">
                <Image
                  className="w-8 rounded-full"
                  src={item.userData.image || assets.upload_area}
                  alt=""
                  width={50}
                  height={50}
                />
                <p>{item.userData.name}</p>
              </div>
              <p>
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </p>
              <div className="flex items-center gap-2">
                <Image
                  className="w-8 rounded-full bg-gray-200"
                  src={item.shopData.image || assets.upload_area}
                  alt=""
                  width={50}
                  height={50}
                />
                <p>{item.shopData.name}</p>
              </div>
              <p>
                {currency}
                {item.amount}
              </p>
              {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-500 text-xs font-medium">Completed</p>
              ) : (
                <div className="flex">
                  <Image
                    onClick={() => handleBookingAction(item._id, "cancel")}
                    className="w-10 cursor-pointer"
                    src={assets.cancel_icon}
                    alt="Cancel"
                    title="Cancel Booking"
                    width={50}
                    height={50}
                  />
                  <Image
                    onClick={() => handleBookingAction(item._id, "complete")}
                    className="w-10 cursor-pointer"
                    src={assets.tick_icon}
                    alt="Complete"
                    title="Complete Booking"
                    width={50}
                    height={50}
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="p-4 text-center text-gray-500">No bookings found</p>
        )}
      </div>
    </div>
  );
};

export default ShopBooking;
