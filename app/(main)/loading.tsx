import React from "react";

export default function HomeLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-10 animate-pulse">
      {/* Hero Banner Skeleton */}
      <div className="h-72 sm:h-96 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-3xl" />

      {/* Feature Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-2xl p-4" />
        ))}
      </div>

      {/* Top Salons Section Skeleton */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded-md w-48" />
          <div className="h-4 bg-gray-200 rounded-md w-16" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-56 bg-gray-100 rounded-2xl p-3" />
          ))}
        </div>
      </div>
    </div>
  );
}
