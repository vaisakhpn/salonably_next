import React from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/server/middleware/auth";
import dbConnect from "@/server/db/mongodb";
import ReferralProfileModel from "@/server/models/ReferralProfile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refer & Earn | LockMyTime",
  description: "Refer salons to LockMyTime and earn ongoing commissions.",
};

const ReferPage = async () => {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  await dbConnect();

  const profile = await ReferralProfileModel.findOne({ userId: user._id }).lean();

  if (!profile) {
    redirect("/refer/setup");
  }

  redirect("/refer/dashboard");
};

export default ReferPage;
