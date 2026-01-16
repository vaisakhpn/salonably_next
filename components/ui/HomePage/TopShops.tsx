import Link from "next/link";
import dbConnect from "@/server/db/mongodb";
import ShopModel from "@/server/models/Shop";
import Image from "next/image";

const TopShops = async () => {
  await dbConnect();

  // Fetch top 4 shops
  const shops = await ShopModel.find({ available: true }).limit(4).lean();

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10 ">
      <h1 className="text-3xl font-medium">Top Salon to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of salon shops.
      </p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-5 px-3 sm:px-0">
        {shops.map((shop: any) => (
          <Link
            key={shop._id}
            href={`/shops/${shop._id}`}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 flex flex-col"
          >
            <Image
              width={300}
              height={250}
              className="bg-blue-50 w-full h-40 object-cover"
              src={shop.image}
              alt={shop.name}
            />

            <div className="p-4 flex-1">
              <div className="flex items-center gap-2 text-sm text-center text-green-500 mb-2">
                <p className="w-2 h-2 rounded-full bg-green-500"></p>
                <p>Available</p>
              </div>
              <p className="text-gray-900 text-lg font-medium">{shop.name}</p>
              <p className="text-gray-500 text-sm">
                {shop.address.line1}
                {shop.address.line2 ? `, ${shop.address.line2}` : ""}
              </p>

              <p className="text-blue-600 text-sm font-medium mt-2">
                ₹{shop.fees}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopShops;
