import Image from "next/image";
import Link from "next/link";
import slider_img from "../../../assets/hero.png";

import { shops } from "@/lib/data";

const AllShops = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ---------- Header ---------- */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Nearby Saloons</h1>
        <p className="text-gray-500 mt-1">
          Book your preferred time slot instantly
        </p>
      </div>

      {/* ---------- Shop Grid ---------- */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shops.map((shop) => (
          <Link
            key={shop.id}
            href={`/shops/${shop.id}`}
            className="group border rounded-xl overflow-hidden bg-white hover:shadow-lg transition"
          >
            <Image
              src={slider_img}
              alt={shop.name}
              width={400}
              height={250}
              className="w-full h-48 object-cover group-hover:scale-105 transition"
            />

            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {shop.name}
              </h2>

              <p className="text-sm text-gray-500 mt-1">{shop.location}</p>

              <p className="mt-3 font-medium text-blue-600">₹{shop.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllShops;
