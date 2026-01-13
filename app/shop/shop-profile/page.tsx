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
    redirect("/admin/login");
  }

  let shopId;
  try {
    const decoded: any = jwt.verify(token.value, JWT_SECRET);
    shopId = decoded.shopId;
  } catch (e) {
    redirect("/admin/login");
  }

  await dbConnect();

  const shopData = await ShopModel.findById(shopId).select("-password");

  if (!shopData) {
    // Handle case where shop is not found
    return <div>Shop not found</div>;
  }

  return (
    <div>
      <ShopProfile shopData={JSON.parse(JSON.stringify(shopData))} />
    </div>
  );
};

export default page;
