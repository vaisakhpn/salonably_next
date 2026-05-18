import React from "react";
import Skeleton from "./Skeleton";

const BookingSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate-pulse">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Shop Image Skeleton */}
        <div className="w-[300px] h-[300px] bg-gray-200 rounded-lg shrink-0"></div>

        {/* Shop Details Skeleton */}
        <div className="flex-1 border rounded-lg p-6 bg-white">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/4 mb-4" />
          
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-5/6 mb-4" />
          
          <Skeleton className="h-5 w-32" />
        </div>
      </div>

      <div className="mt-10">
        <Skeleton className="h-6 w-32 mb-4" />

        {/* Days Scroll Skeleton */}
        <div className="flex gap-4 overflow-x-auto pb-4 p-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="min-w-[70px] h-[60px] bg-gray-200 rounded-md"></div>
          ))}
        </div>

        {/* Times Scroll Skeleton */}
        <div className="flex gap-3 mt-6 overflow-x-auto">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="min-w-[80px] h-[36px] bg-gray-200 rounded-full"></div>
          ))}
        </div>
        
        {/* Button Skeleton */}
        <Skeleton className="h-12 w-full sm:w-[200px] mt-6 rounded-full" />
      </div>
    </div>
  );
};

export default BookingSkeleton;
