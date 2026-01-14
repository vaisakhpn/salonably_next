
import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AddShop from "@/components/Admin/AddShop";

const page = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (!token) {
    redirect("/admin");
  }

  return (
    <div>
      <AddShop />
    </div>
  );
};

export default page;
