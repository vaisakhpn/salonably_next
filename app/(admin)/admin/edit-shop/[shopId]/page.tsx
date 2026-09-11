import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dbConnect from "@/server/db/mongodb";
import ShopModel from "@/server/models/Shop";
import EditShop from "@/components/Admin/EditShop";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    shopId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { shopId } = await params;
  await dbConnect();
  const shop = await ShopModel.findById(shopId).select("name").lean();
  return {
    title: shop ? `Edit ${shop.name} | Admin` : "Edit Salon | Admin",
  };
}

const Page = async ({ params }: PageProps) => {
  const { shopId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (!token) {
    redirect("/admin");
  }

  await dbConnect();
  const shop = await ShopModel.findById(shopId).lean();

  if (!shop) {
    redirect("/admin/shop-list");
  }

  const serializedShop = {
    ...shop,
    _id: (shop as any)._id.toString(),
  };

  return (
    <div>
      <EditShop shopData={JSON.parse(JSON.stringify(serializedShop))} />
    </div>
  );
};

export default Page;
