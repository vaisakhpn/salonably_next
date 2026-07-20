import Link from "next/link";
import dbConnect from "@/server/db/mongodb";
import ShopModel from "@/server/models/Shop";
import ShopCard from "../ShopCard";
import MobileHomePage from "./MobileHomePage";

const TopShops = async () => {
  await dbConnect();

  // Fetch top 4 shops
  const shopsData = await ShopModel.find({ available: true })
    .sort({ date: -1 })
    .limit(4)
    .lean();

  const shops = JSON.parse(JSON.stringify(shopsData));

  return (
    <>
      {/* Mobile & Tablet View (< md) */}
      <MobileHomePage shops={shops} />

      {/* Desktop View (>= md) */}
      <div className="hidden md:block my-12 max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Section Header */}
        <div className="flex items-end justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Top Rated Salons Near You
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Handpicked top-rated beauty and wellness spots
            </p>
          </div>
          <Link
            href="/shops"
            className="text-xs sm:text-sm font-bold text-blue-600 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View all</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {shops.map((shop: any) => (
            <ShopCard key={shop._id} shop={shop} />
          ))}
        </div>
      </div>
    </>
  );
};

export default TopShops;
