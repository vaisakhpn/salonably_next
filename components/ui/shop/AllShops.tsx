import React from "react";
import ShopCard, { ShopData } from "../ShopCard";

interface AllShopsProps {
  shops: ShopData[];
}

const AllShops: React.FC<AllShopsProps> = ({ shops }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ---------- Header ---------- */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-gray-900">Salons</h1>
        <p className="text-gray-500 mt-2 text-lg">
          Book your preferred time slot instantly
        </p>
      </div>

      {/* ---------- Shop Grid ---------- */}
      {shops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shops.map((shop) => (
            <ShopCard key={shop._id} shop={shop} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No shops found.</p>
        </div>
      )}
    </div>
  );
};

export default AllShops;
