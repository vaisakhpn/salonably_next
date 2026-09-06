import React from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/server/middleware/auth";
import dbConnect from "@/server/db/mongodb";
import ReferralProfileModel from "@/server/models/ReferralProfile";
import ReferralSetup from "@/components/Referral/ReferralSetup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refer & Earn Setup | LockMyTime",
  description: "Set up your referral profile to earn commissions by referring salons to LockMyTime.",
};

const ReferralSetupPage = async () => {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  await dbConnect();

  const profile = await ReferralProfileModel.findOne({ userId: user._id }).lean();

  if (profile) {
    // Already has profile, send directly to dashboard
    redirect("/refer/dashboard");
  }

  return (
    <div className="py-6 sm:py-10">
      <ReferralSetup
        user={{
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || "",
        }}
      />
    </div>
  );
};

export default ReferralSetupPage;
