import Booking from "@/components/ui/shop/Booking";
import React from "react";
import dbConnect from "@/server/db/mongodb";
import ShopModel from "@/server/models/Shop";

import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    shopId: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { shopId } = await params;
  await dbConnect();
  const shop = await ShopModel.findById(shopId).lean();

  if (!shop) {
    return {
      title: "Shop Not Found",
      description: "The requested shop could not be found.",
    };
  }

  return {
    title: shop.name,
    description: shop.about || `Book an appointment at ${shop.name}.`,
    openGraph: {
      title: `${shop.name} | Salonably`,
      description: shop.about || `Book an appointment at ${shop.name}.`,
      images: shop.image ? [shop.image] : [],
    },
  };
}

import BookingModel from "@/server/models/Booking";
import { getUser } from "@/server/middleware/auth";

const Page = async ({ params }: PageProps) => {
  const { shopId } = await params;
  await dbConnect();
  
  // Parallel fetch shop data, occupied slots, and user status
  const [shop, user, activeBookings] = await Promise.all([
    ShopModel.findById(shopId).lean(),
    getUser(),
    BookingModel.find({
      shopId,
      $or: [
        { status: "booked" },
        { status: "held", expiresAt: { $gt: new Date() } }
      ]
    }).select("slotDate slotTime").lean()
  ]);

  if (!shop) {
    return <div className="text-center py-10">Shop not found</div>;
  }

  // Format occupied slots
  const initialOccupiedSlots = activeBookings.map((b: any) => ({
    date: b.slotDate,
    time: b.slotTime,
  }));

  // Serialize the shop object to pass to client component
  const serializedShop = {
    ...shop,
    _id: shop._id.toString(),
  };

  return (
    <div>
      <Booking 
        shopData={serializedShop} 
        initialOccupiedSlots={initialOccupiedSlots}
        isUserLoggedIn={!!user}
      />
    </div>
  );
};

export default Page;
