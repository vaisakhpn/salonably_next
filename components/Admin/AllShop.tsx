"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
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
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium ">All Shops</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {shops.map((item, index) => (
          <ShopItem
            key={index}
            item={item}
            changeAvailability={changeAvailability}
          />
        ))}
      </div>
    </div>
  );
};

export default AllShops;
