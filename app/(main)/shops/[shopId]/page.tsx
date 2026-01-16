import Booking from "@/components/ui/shop/Booking";
import React from "react";
import dbConnect from "@/server/db/mongodb";
import ShopModel from "@/server/models/Shop";

interface PageProps {
  params: Promise<{
    shopId: string;
  }>;
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
