import Navbar from "@/components/Shop/Navbar";
import Sidebar from "@/components/Shop/Sidebar";
import React from "react";
import { getShop } from "@/server/middleware/auth";
import dbConnect from "@/server/db/mongodb";
import { getShopLiveRanking } from "@/server/services/competitionService";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const shop = await getShop();

  if (!shop) {
    return <>{children}</>;
  }

  await dbConnect();

  // Retrieve accurate competition status and winner award details for this salon
  const competitionData = await getShopLiveRanking(shop._id);

  const winnerReward = competitionData.isWinner
    ? {
        isWinner: true,
        rewardAmount: competitionData.rewardAmount,
        quarter: competitionData.quarter,
        completedBookings: competitionData.completedBookings,
      }
    : undefined;

  return (
    <div className="bg-[#F8F9FD] min-h-screen">
      <Navbar shopName={shop.name} winnerReward={winnerReward} />
      <div className="flex items-start">
        <Sidebar />
        <div className="flex-1 w-full pb-24 md:pb-6 overflow-x-hidden">{children}</div>
      </div>
    </div>
  );
};

export default layout;
