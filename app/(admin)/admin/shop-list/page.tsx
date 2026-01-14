import AllShops from "@/components/Admin/AllShop";
import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dbConnect from "@/server/db/mongodb";
import ShopModel from "@/server/models/Shop";

const page = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (!token) {
    redirect("/admin");
  }

  await dbConnect();

  const shops = await ShopModel.find({});

  return (
    <div>
      <AllShops shops={JSON.parse(JSON.stringify(shops))} />
    </div>
  );
};

export default page;
