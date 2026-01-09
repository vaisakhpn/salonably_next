import Image from "next/image";
import Link from "next/link";
import { shops } from "@/lib/data";
import slider_img from "../../../assets/hero.png";

const TopShops = () => {
  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10 ">
      <h1 className="text-3xl font-medium">Top Salon to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of salon shops.
      </p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-5 px-3 sm:px-0">
        {shops.slice(0, 4).map((shop) => (
          <Link
            key={shop.id}
            href={`/shops/${shop.id}`}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 flex flex-col"
          >
            <Image
              className="bg-blue-50 w-full h-40 object-cover"
              src={slider_img}
              alt={shop.name}
            />

            <div className="p-4 flex-1">
              <div className="flex items-center gap-2 text-sm text-center text-green-500 mb-2">
                <p className="w-2 h-2 rounded-full bg-green-500"></p>
                <p>Available</p>
              </div>
              <p className="text-gray-900 text-lg font-medium">{shop.name}</p>
              <p className="text-gray-500 text-sm">{shop.location}</p>
              <p className="text-blue-600 text-sm font-medium mt-2">
                ₹{shop.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopShops;
