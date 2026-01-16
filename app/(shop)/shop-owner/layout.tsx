import Navbar from "@/components/Shop/Navbar";
import Sidebar from "@/components/Shop/Sidebar";
import React from "react";
import { getShop } from "@/server/middleware/auth";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const shop = await getShop();

  if (!shop) {
    return <>{children}</>;
  }

  return (
    <div className="bg-[#F8F9FD]">
      <Navbar shopName={shop.name} />
      <div className="flex items-start">
        <Sidebar />
        <div>{children}</div>
      </div>
    </div>
  );
};

export default layout;
