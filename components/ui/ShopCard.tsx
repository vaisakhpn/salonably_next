"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export interface ShopData {
  _id: string;
  name: string;
  image: string;
  fees: number;
  address: {
    line1: string;
    line2?: string;
  };
  available?: boolean;
}

interface ShopCardProps {
  shop: ShopData;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  const [imgSrc, setImgSrc] = useState(shop.image);

  return (
    <Link
      href={`/shops/${shop._id}`}
      className="group block border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white"
    >
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
        <Image
          src={imgSrc}
          alt={shop.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() =>
            setImgSrc(
              "https://cdn3.iconfinder.com/data/icons/essential-rounded/64/Rounded-31-512.png"
            )
          }
        />
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {shop.name}
          </h3>
          {shop.available !== undefined && (
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                shop.available
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  shop.available ? "bg-green-500" : "bg-red-500"
                }`}
              />
              {shop.available ? "Available" : "Unavailable"}
            </div>
          )}
        </div>

        <div className="space-y-1 mb-4">
          <p className="text-gray-500 text-sm line-clamp-1">
            {shop.address.line1}
          </p>
          {shop.address.line2 && (
            <p className="text-gray-400 text-xs line-clamp-1">
              {shop.address.line2}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            Booking Fee
          </span>
          <span className="text-blue-600 font-bold">₹{shop.fees}</span>
        </div>
      </div>
    </Link>
  );
};

export default ShopCard;
