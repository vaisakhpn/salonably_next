import AllShops from "@/components/ui/shop/AllShops";
import dbConnect from "@/server/db/mongodb";
import ShopModel from "@/server/models/Shop";
import React from "react";

interface PageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Salons",
  description:
    "Explore our extensive list of top-rated salons and book your appointment today.",
};

const page = async ({ searchParams }: PageProps) => {
  const { query, page } = await searchParams;
  const pageNumber = parseInt(page || "1", 10);
  const pageSize = 8; // Adjust as needed
  const skip = (pageNumber - 1) * pageSize;

  await dbConnect();

  let filter: any = { available: true };

  if (query) {
    // Utilize MongoDB Text Index for lightning-fast search
    filter = {
      ...filter,
      $text: { $search: query }
    };
  }

  const totalShops = await ShopModel.countDocuments(filter);
  const totalPages = Math.ceil(totalShops / pageSize);

  const shops = await ShopModel.find(filter).skip(skip).limit(pageSize).lean();

  // Serialize for Client Component
  const serializedShops = JSON.parse(JSON.stringify(shops));

  return (
    <div>
      <AllShops
        shops={serializedShops}
        currentPage={pageNumber}
        totalPages={totalPages}
      />
    </div>
  );
};

export default page;
