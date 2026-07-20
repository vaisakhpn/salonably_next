import Login from "@/components/ui/Login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login & Sign Up",
  description:
    "Sign in or create a LockMyTime account to manage your salon bookings and appointments.",
};
const page = () => {
  return (
    <div>
      <Login />
    </div>
  );
};

export default page;
