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

const Page = async ({ params }: PageProps) => {
  const { shopId } = await params;
  await dbConnect();
  const shop = await ShopModel.findById(shopId).lean();

  if (!shop) {
    return <div className="text-center py-10">Shop not found</div>;
  }

  // Serialize the shop object to pass to client component
  const serializedShop = {
    ...shop,
    _id: shop._id.toString(),
    // Ensure other non-serializable fields are handled if necessary
  };

  return (
    <div>
      <Booking shopData={serializedShop} />
    </div>
  );
};

export default Page;
