import Navbar from "@/components/Admin/Navbar";
import Sidebar from "@/components/Admin/Sidebar";
import React from "react";
import { cookies } from "next/headers";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (!token) {
    return <>{children}</>;
  }

  return (
    <div className="bg-[#F8F9FD] min-h-screen">
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <div className="flex-1 w-full pb-24 md:pb-6 overflow-x-hidden">{children}</div>
      </div>
    </div>
  );
};

export default layout;
