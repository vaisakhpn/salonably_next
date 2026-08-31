import React, { Suspense } from "react";
import TopShops from "@/components/ui/HomePage/TopShops";
import Banner from "@/components/ui/HomePage/Banner";
import TopShopsSkeleton from "@/components/ui/HomePage/TopShopsSkeleton";
import Header from "@/components/ui/HomePage/Header";
import StatsBanner from "@/components/ui/HomePage/StatsBanner";
import ExploreServices from "@/components/ui/HomePage/ExploreServices";
import DiscoverPage from "@/components/ui/HomePage/DiscoverPage";

import { Metadata } from "next";

// Cache page at Edge CDN and revalidate in background every 60 seconds (ISR)
export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.lockmytime.shop"),

  title: {
    absolute: "LockMyTime | Book Salon, Spa, Beauty & Clinic Appointments Online",
  },

  description:
    "Book appointments with trusted salons, beauty parlours, spas and clinics near you.",

  keywords: [
    "LockMyTime",
    "lockmytime",
    "Lock My Time",
    "lock my time",
    "hair cut",
    "salon booking",
    "beauty booking",
    "spa",
    "doctor appointment",
    "clinic booking",
  ],

  openGraph: {
    title: "LockMyTime",
    description: "Book salon, beauty, spa and clinic appointments in seconds.",
    url: "https://www.lockmytime.shop",
    siteName: "LockMyTime",
    locale: "en_IN",
    type: "website",
  },

  alternates: {
    canonical: "https://www.lockmytime.shop",
  },
};

const page = () => {
  return (
    <div>
      {/* Desktop Homepage Layout (>= md) */}
      <div className="hidden md:block space-y-12">
        <Header />
        <StatsBanner />
        <ExploreServices />
        <Suspense fallback={<TopShopsSkeleton />}>
          <TopShops />
        </Suspense>
        <DiscoverPage />
        <Banner />
      </div>

      {/* Mobile & Tablet App-Style Homepage Layout (< md) */}
      <div className="block md:hidden">
        <Suspense fallback={<TopShopsSkeleton />}>
          <TopShops />
        </Suspense>
      </div>
    </div>
  );
};

export default page;
