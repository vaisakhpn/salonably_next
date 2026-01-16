import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Address {
  line1: string;
  line2: string;
}

interface Shop {
  _id: string;
  name: string;
  image: string;
  fees: number;
  address: Address;
  location?: string; // Backwards compatibility if needed, but we'll use address
  price?: number; // Backwards compatibility
}

interface AllShopsProps {
  shops: Shop[];
}

const AllShops: React.FC<AllShopsProps> = ({ shops }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ---------- Header ---------- */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Salons</h1>
        <p className="text-gray-500 mt-1">
          Book your preferred time slot instantly
        </p>
      </div>

      {/* ---------- Shop Grid ---------- */}
      {shops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {shops.map((shop) => (
            <Link
              key={shop._id}
              href={`/shops/${shop._id}`}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 flex flex-col"
            >
              <Image
                src={shop.image}
                alt={shop.name}
                width={300}
                height={250}
                className="bg-blue-50 w-full h-40 object-cover"
              />

              <div className="p-4 flex-1">
                <h2 className="text-gray-900 text-lg font-medium">
                  {shop.name}
                </h2>

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
      ) : (
        <p className="text-center text-gray-500 mt-10">No shops found.</p>
      )}
    </div>
  );
};

export default AllShops;
