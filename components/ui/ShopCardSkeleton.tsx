import React from "react";
import Skeleton from "./Skeleton";

const ShopCardSkeleton = () => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Image Skeleton */}
      <Skeleton className="w-full h-48" />

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          {/* Name Skeleton */}
          <Skeleton className="h-6 w-2/3" />
          {/* Availability Badge Skeleton */}
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>

        <div className="space-y-2 mb-4">
          {/* Address Line 1 Skeleton */}
          <Skeleton className="h-4 w-full" />
          {/* Address Line 2 Skeleton */}
          <Skeleton className="h-3 w-3/4" />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* Fee Label Skeleton */}
          <Skeleton className="h-3 w-16" />
          {/* Fee Value Skeleton */}
          <Skeleton className="h-5 w-12" />
        </div>
      </div>
    </div>
  );
};

export default ShopCardSkeleton;
