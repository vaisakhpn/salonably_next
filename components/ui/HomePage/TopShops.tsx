import Link from "next/link";
import dbConnect from "@/server/db/mongodb";
import ShopModel from "@/server/models/Shop";
import ShopCard from "../ShopCard";

const TopShops = async () => {
  await dbConnect();

  // Fetch top 4 shops
  const shops = await ShopModel.find({ available: true }).limit(4).lean();

  // Serialize for client component (if ShopCard was client, but it's not strictly required here as it's rendered in server component)
  // However, passing lean() result is usually fine for server components.
  // We need to map to match ShopData interface if there are discrepancies, but ShopModel matches well.

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-bold text-gray-900">Top Salons to Book</h1>
      <p className="sm:w-1/3 text-center text-gray-500 text-sm">
        Simply browse through our extensive list of salon shops.
      </p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-5 px-3 sm:px-0">
        {shops.map((shop: any) => (
          <ShopCard key={shop._id} shop={shop} />
        ))}
      </div>
      <Link
        href="/shops"
        className="bg-blue-50 text-blue-600 font-medium px-8 py-3 rounded-full mt-8 hover:bg-blue-100 transition-colors"
      >
        View All Salons
      </Link>
    </div>
  );
};

export default TopShops;
