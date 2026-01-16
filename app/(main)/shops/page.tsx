import AllShops from "@/components/ui/shop/AllShops";
import dbConnect from "@/server/db/mongodb";
import ShopModel from "@/server/models/Shop";
import React from "react";

interface PageProps {
  searchParams: Promise<{
    query?: string;
  }>;
}

const page = async ({ searchParams }: PageProps) => {
  const { query } = await searchParams;

  await dbConnect();

  let filter: any = { available: true };

  if (query) {
    // Simple case-insensitive regex search on name or address line 1
    // Note: MongoDB regex might be slow on large datasets, but fine for now.
    const regex = new RegExp(query, "i");
    filter = {
      ...filter,
      $or: [
        { name: regex },
        { "address.line1": regex },
        { "address.line2": regex },
      ],
    };
  }

  const shops = await ShopModel.find(filter).lean();

  // Serialize for Client Component
  const serializedShops = JSON.parse(JSON.stringify(shops));

  return (
    <div>
      <AllShops shops={serializedShops} />
    </div>
  );
};

export default page;
