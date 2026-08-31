import AllShops from "@/components/ui/shop/AllShops";
import dbConnect from "@/server/db/mongodb";
import ShopModel from "@/server/models/Shop";
import React, { Suspense } from "react";
import Loading from "./loading";

interface PageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}

import { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Browse Salons",
  description:
    "Explore our extensive list of top-rated salons and book your appointment today.",
};

const ShopsListContent = async ({
  query,
  pageNumber,
}: {
  query?: string;
  pageNumber: number;
}) => {
  const pageSize = 8; // Adjust as needed
  const skip = (pageNumber - 1) * pageSize;

  await dbConnect();

  let filter: any = { available: true };

  if (query && query.trim()) {
    const trimmed = query.trim();
    const escapedQuery = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^${escapedQuery}`, "i");
    const containsRegex = new RegExp(escapedQuery, "i");

    filter = {
      available: true,
      $or: [
        { $text: { $search: trimmed } },
        { name: { $regex: prefixRegex } },
        { "address.line1": { $regex: containsRegex } },
        { "address.line2": { $regex: containsRegex } },
      ],
    };
  }

  const [totalShops, shops] = await Promise.all([
    ShopModel.countDocuments(filter),
    ShopModel.find(filter)
      .sort(query ? { score: { $meta: "textScore" }, date: -1 } : { date: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),
  ]);

  const totalPages = Math.ceil(totalShops / pageSize);

  // Serialize for Client Component
  const serializedShops = JSON.parse(JSON.stringify(shops));

  return (
    <AllShops
      shops={serializedShops}
      currentPage={pageNumber}
      totalPages={totalPages}
      query={query}
    />
  );
};

const page = async ({ searchParams }: PageProps) => {
  const { query, page } = await searchParams;
  const pageNumber = parseInt(page || "1", 10);
  const key = `${query || ""}_${pageNumber}`;

  return (
    <div>
      <Suspense key={key} fallback={<Loading />}>
        <ShopsListContent query={query} pageNumber={pageNumber} />
      </Suspense>
    </div>
  );
};

export default page;
