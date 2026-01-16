import React, { Suspense } from "react";
import TopShops from "@/components/ui/HomePage/TopShops";
import Banner from "@/components/ui/HomePage/Banner";
import TopShopsSkeleton from "@/components/ui/HomePage/TopShopsSkeleton";
import Header from "@/components/ui/HomePage/Header";
import DiscoverPage from "@/components/ui/HomePage/DiscoverPage";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Discover and book the best salons near you.",
};

const page = () => {
  return (
    <div>
      <Header />
      <Suspense fallback={<TopShopsSkeleton />}>
        <TopShops />
      </Suspense>
      <DiscoverPage />
      <Banner />
    </div>
  );
};

export default page;
