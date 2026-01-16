import React, { Suspense } from "react";
import HomePage from "./HomePage";
import TopShops from "@/components/ui/HomePage/TopShops";
import Banner from "@/components/ui/HomePage/Banner";
import TopShopsSkeleton from "@/components/ui/HomePage/TopShopsSkeleton";

const page = () => {
  return (
    <div>
      <HomePage />
      <Suspense fallback={<TopShopsSkeleton />}>
        <TopShops />
      </Suspense>
      <Banner />
    </div>
  );
};

export default page;
