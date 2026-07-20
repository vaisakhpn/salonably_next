import React from "react";

export default function MyBookingsLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-6 animate-pulse">
      {/* Header Banner Skeleton */}
      <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-3xl p-6 sm:p-8 h-36 flex flex-col justify-between" />

      {/* Filter Tabs Skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 w-24 bg-gray-200 rounded-full shrink-0" />
        ))}
      </div>

      {/* Booking Cards Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 flex flex-col sm:flex-row gap-4"
          >
            <div className="w-full sm:w-36 h-32 bg-gray-200 rounded-xl shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-gray-200 rounded-md w-3/4" />
                  <div className="h-3 bg-gray-200 rounded-md w-1/2" />
                </div>
                <div className="h-6 bg-gray-200 rounded-md w-16" />
              </div>

              <div className="flex gap-2 pt-2">
                <div className="h-6 bg-gray-200 rounded-md w-28" />
                <div className="h-6 bg-gray-200 rounded-md w-24" />
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div className="h-3 bg-gray-200 rounded-md w-24" />
                <div className="h-8 bg-gray-200 rounded-full w-28" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
