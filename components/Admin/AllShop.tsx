"use client";

import React, { useState } from "react";
import { toast } from "@/lib/toast";
import Image from "next/image";

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
    <div className="border border-indigo-200 hover:translate-y-[-10px] transition-all duration-500 rounded-xl max-w-56 overflow-hidden cursor-pointer group ">
      <Image
        className="bg-indigo-50 w-56 h-40 object-cover "
        src={imgSrc}
        alt="shop image"
        width={224}
        height={160}
        onError={() =>
          setImgSrc(
            "https://cdn3.iconfinder.com/data/icons/essential-rounded/64/Rounded-31-512.png"
          )
        }
      />
      <div className="p-4 ">
        <p className="text-neutral-800 text-lg font-medium">{item.name}</p>
        <div className="flex mt-2 items-center gap-1 text-sm">
          <input
            onChange={() => changeAvailability(item._id)}
            type="checkbox"
            checked={item.available}
          />
          <p>Available</p>
        </div>
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
