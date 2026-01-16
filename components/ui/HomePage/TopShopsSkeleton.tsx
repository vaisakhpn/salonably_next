import React from "react";
import ShopCardSkeleton from "../ShopCardSkeleton";

const TopShopsSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10 animate-pulse">
      <div className="h-8 w-64 bg-gray-200 rounded-md" />
      <div className="h-4 w-96 bg-gray-200 rounded-md" />

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-5 px-3 sm:px-0">
        {Array.from({ length: 4 }).map((_, index) => (
          <ShopCardSkeleton key={index} />
        ))}
      </div>

      <div className="h-12 w-40 bg-gray-200 rounded-full mt-8" />
    </div>
  );
};

export default TopShopsSkeleton;
