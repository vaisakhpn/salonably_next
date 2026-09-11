"use client";

import React, { useState } from "react";
import { toast } from "@/lib/toast";
import Image from "next/image";
import Link from "next/link";

interface AllShopsProps {
  shops: any[];
}

const ShopItem = ({
  item,
  changeAvailability,
}: {
  item: any;
  changeAvailability: (id: string) => void;
}) => {
  const [imgSrc, setImgSrc] = useState(
    item.image ||
      "https://cdn3.iconfinder.com/data/icons/essential-rounded/64/Rounded-31-512.png"
  );

  return (
    <div className="border border-indigo-100 hover:border-blue-300 hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden bg-white flex flex-col justify-between group">
      <div>
        <div className="relative w-full h-40 bg-indigo-50 overflow-hidden">
          <Image
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            src={imgSrc}
            alt={item.name || "Shop image"}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() =>
              setImgSrc(
                "https://cdn3.iconfinder.com/data/icons/essential-rounded/64/Rounded-31-512.png"
              )
            }
          />
        </div>
        <div className="p-3.5">
          <p className="text-gray-900 text-base font-bold truncate">{item.name}</p>
          {item.address?.line1 && (
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {[item.address.line1, item.address.line2].filter(Boolean).join(", ")}
            </p>
          )}
          <p className="text-xs font-semibold text-blue-600 mt-1">₹{item.fees} fee</p>
        </div>
      </div>

      <div className="px-3.5 pb-3.5 pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
        {/* Available Checkbox */}
        <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-gray-700 select-none">
          <input
            onChange={() => changeAvailability(item._id)}
            type="checkbox"
            checked={item.available}
            className="w-3.5 h-3.5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
          />
          <span className={item.available ? "text-emerald-600 font-semibold" : "text-gray-500"}>
            {item.available ? "Active" : "Offline"}
          </span>
        </label>

        {/* Edit Button */}
        <Link
          href={`/admin/edit-shop/${item._id}`}
          className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white px-2.5 py-1 rounded-lg text-xs font-semibold border border-blue-200/80 transition-all duration-200 active:scale-95 shadow-2xs cursor-pointer"
          title="Edit shop details"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Edit</span>
        </Link>
      </div>
    </div>
  );
};

const AllShops = ({ shops }: AllShopsProps) => {
  const changeAvailability = async (docId: string) => {
    try {
      const response = await fetch("/api/admin/change-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docId }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        window.location.reload();
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            All Shops
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            View and toggle vendor availability
          </p>
        </div>
        {shops && (
          <span className="bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-purple-100">
            {shops.length} Shops
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {shops && shops.length > 0 ? (
          shops.map((item, index) => (
            <ShopItem
              key={item._id || index}
              item={item}
              changeAvailability={changeAvailability}
            />
          ))
        ) : (
          <div className="col-span-full p-8 text-center text-gray-500 text-sm font-semibold bg-gradient-to-r from-blue-50/50 via-white to-indigo-50/50 rounded-2xl border border-blue-100 shadow-xs">
            📍 We are coming soon in this <span className="text-blue-600 font-bold">Area</span>.
          </div>
        )}
      </div>
    </div>
  );
};

export default AllShops;
