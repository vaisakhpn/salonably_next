import ShopProfile from "@/components/Shop/ShopProfile";
import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dbConnect from "@/server/db/mongodb";
import ShopModel from "@/server/models/Shop";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const page = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("shop_token");

  if (!token) {
    redirect("/shop-owner");
  }

  // Verify token and get shopId
  // Note: We need to handle invalid tokens (e.g. expired) which jwt.verify throws on
  let shopId;
  try {
    const decoded = jwt.verify(token.value, JWT_SECRET) as any;
    shopId = decoded.shopId;
  } catch (error) {
    redirect("/shop-owner");
  }

  await dbConnect();

  const shop = await ShopModel.findById(shopId).lean();

  if (!shop) {
    redirect("/shop-owner");
  }

  // Normalize data with safe defaults to guarantee no runtime rendering exceptions
  const shopData = {
    _id: (shop._id as any).toString(),
    name: shop.name || "",
    email: shop.email || "",
    phone: shop.phone || "",
    image:
      shop.image ||
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&auto=format&fit=crop&q=80",
    about: shop.about || `Welcome to ${shop.name || "our salon"}`,
    fees: typeof shop.fees === "number" ? shop.fees : 500,
    address: {
      line1: shop.address?.line1 || "Main Street",
      line2: shop.address?.line2 || "City Center",
    },
    available: typeof shop.available === "boolean" ? shop.available : true,
    availableSlots:
      Array.isArray(shop.availableSlots) && shop.availableSlots.length > 0
        ? shop.availableSlots
        : ["11:00 AM", "03:00 PM", "06:30 PM"],
    closedDays: Array.isArray(shop.closedDays) ? shop.closedDays : [],
  };

  return (
    <div>
      <ShopProfile shopData={shopData} />
    </div>
  );
};

export default page;
