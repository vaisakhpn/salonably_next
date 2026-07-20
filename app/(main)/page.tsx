import React, { Suspense } from "react";
import TopShops from "@/components/ui/HomePage/TopShops";
import Banner from "@/components/ui/HomePage/Banner";
import TopShopsSkeleton from "@/components/ui/HomePage/TopShopsSkeleton";
import Header from "@/components/ui/HomePage/Header";
import DiscoverPage from "@/components/ui/HomePage/DiscoverPage";

import { Metadata } from "next";

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
