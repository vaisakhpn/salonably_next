import React from "react";

export default function ProfileLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-pulse">
      {/* Cover Banner & Avatar Skeleton */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs">
        <div className="h-32 sm:h-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
        <div className="px-6 pb-6 pt-0 relative flex flex-col items-center sm:items-start">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-300 border-4 border-white -mt-12 sm:-mt-14 shadow-md" />
          <div className="mt-4 space-y-2 text-center sm:text-left w-full">
            <div className="h-6 bg-gray-200 rounded-md w-48 mx-auto sm:mx-0" />
            <div className="h-4 bg-gray-200 rounded-md w-64 mx-auto sm:mx-0" />
          </div>
        </div>
      </div>

      {/* Form Fields Skeleton */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 space-y-6 shadow-xs">
        <div className="h-5 bg-gray-200 rounded-md w-36" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded-md w-20" />
            <div className="h-11 bg-gray-100 rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded-md w-24" />
            <div className="h-11 bg-gray-100 rounded-xl" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <div className="h-3 bg-gray-200 rounded-md w-28" />
            <div className="h-11 bg-gray-100 rounded-xl" />
          </div>
        </div>
        <div className="h-10 bg-gray-200 rounded-full w-32" />
      </div>
    </div>
  );
}
