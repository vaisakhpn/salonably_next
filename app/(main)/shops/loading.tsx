import React from "react";

export default function ShopsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-pulse">
      {/* Header & Search Bar Skeleton */}
      <div className="space-y-3">
        <div className="h-8 bg-gray-200 rounded-md w-48" />
        <div className="h-4 bg-gray-200 rounded-md w-72" />
        <div className="h-12 bg-gray-100 rounded-2xl w-full max-w-xl mt-4" />
      </div>

      {/* Filter Categories Skeleton */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-28 bg-gray-200 rounded-2xl shrink-0" />
        ))}
      </div>

      {/* Salons Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs space-y-3 p-3"
          >
            <div className="h-40 bg-gray-200 rounded-xl w-full" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded-md w-3/4" />
              <div className="h-3 bg-gray-200 rounded-md w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-4 bg-gray-200 rounded-md w-16" />
                <div className="h-6 bg-gray-200 rounded-full w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
