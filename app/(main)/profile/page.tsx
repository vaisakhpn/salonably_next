
import MyProfile from "@/components/ui/Profile/MyProfile";
import React from "react";
import { Metadata } from "next";
import { getUser } from "@/server/middleware/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "My Profile",
  description:
    "Manage your personal account details, preferences, and booking history on LockMyTime.",
};

const page = async () => {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <MyProfile initialUserData={JSON.parse(JSON.stringify(user))} />
    </div>
  );
};

export default page;