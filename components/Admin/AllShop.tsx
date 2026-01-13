"use client";

import React from "react";
import { toast } from "react-toastify";

interface AllShopsProps {
  shops: any[];
}

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
          <div
            className="border border-indigo-200 hover:translate-y-[-10px] transition-all duration-500 rounded-xl max-w-56 overflow-hidden cursor-pointer group "
            key={index}
          >
            <img
              className="bg-indigo-50 w-56 h-40 object-cover "
              src={item.image}
              alt="shop image"
            />
            <div className="p-4 ">
              <p className="text-neutral-800 text-lg font-medium">
                {item.name}
              </p>
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
        ))}
      </div>
    </div>
  );
};

export default AllShops;
