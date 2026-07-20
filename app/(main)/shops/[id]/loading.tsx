import React from "react";

export default function ShopDetailLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-pulse">
      {/* Cover Image Skeleton */}
      <div className="h-64 sm:h-80 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-3xl" />

      {/* Shop Info Skeleton */}
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded-md w-64" />
        <div className="h-4 bg-gray-200 rounded-md w-96" />
        <div className="flex gap-3 pt-2">
          <div className="h-6 bg-gray-200 rounded-full w-20" />
          <div className="h-6 bg-gray-200 rounded-full w-24" />
        </div>
      </div>

      {/* Date & Time Picker Skeleton */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 space-y-4 shadow-xs">
        <div className="h-5 bg-gray-200 rounded-md w-40" />
        <div className="flex gap-3 overflow-x-auto">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-16 w-16 bg-gray-200 rounded-2xl shrink-0" />
          ))}
        </div>
      </div>

      {/* Services List Skeleton */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 space-y-4 shadow-xs">
        <div className="h-5 bg-gray-200 rounded-md w-36" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded-md w-40" />
              <div className="h-3 bg-gray-200 rounded-md w-24" />
            </div>
            <div className="h-8 bg-gray-200 rounded-full w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
