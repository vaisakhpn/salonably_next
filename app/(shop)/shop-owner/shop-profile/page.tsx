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

  const shop = await ShopModel.findById(shopId);

  // Serialize Mongoose document
  const shopData = JSON.parse(JSON.stringify(shop));

  return (
    <div>
      <ShopProfile shopData={shopData} />
    </div>
  );
};

export default page;
