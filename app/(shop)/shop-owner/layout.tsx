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
    <div className="bg-[#F8F9FD] min-h-screen">
      <Navbar shopName={shop.name} />
      <div className="flex items-start">
        <Sidebar />
        <div className="flex-1 w-full pb-24 md:pb-6 overflow-x-hidden">{children}</div>
      </div>
    </div>
  );
};

export default layout;
