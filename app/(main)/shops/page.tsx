import AllShops from "@/components/ui/shop/AllShops";
import { shops } from "@/lib/data";
import React from "react";

interface PageProps {
  searchParams: Promise<{
    query?: string;
  }>;
}

const page = async ({ searchParams }: PageProps) => {
  const { query } = await searchParams;
  
  let filteredShops = shops;
  
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredShops = shops.filter((shop) => {
      const shopData = `${shop.name} ${shop.location}`.toLowerCase();
      return shopData.includes(lowerQuery);
    });
  }

  return (
    <div>
      <AllShops shops={filteredShops} />
    </div>
  );
};

export default page;
