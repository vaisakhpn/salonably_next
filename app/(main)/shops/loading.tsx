import React from "react";
import ShopCardSkeleton from "@/components/ui/ShopCardSkeleton";

const Loading = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ---------- Header ---------- */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-gray-900">Salons</h1>
        <p className="text-gray-500 mt-2 text-lg">
          Book your preferred time slot instantly
        </p>
      </div>

      {/* ---------- Shop Grid Skeleton ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <ShopCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default Loading;
