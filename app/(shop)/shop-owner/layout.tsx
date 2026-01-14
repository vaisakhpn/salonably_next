import Navbar from "@/components/Shop/Navbar";
import Sidebar from "@/components/Shop/Sidebar";
import React from "react";
import { cookies } from "next/headers";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("shop_token");

  if (!token) {
    return <>{children}</>;
  }

  return (
    <div className="bg-[#F8F9FD]">
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <div>{children}</div>
      </div>
    </div>
  );
};

export default layout;
