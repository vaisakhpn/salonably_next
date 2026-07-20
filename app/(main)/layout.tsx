import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import MobileCustomerBottomNav from "@/components/ui/MobileCustomerBottomNav";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen pb-16 sm:pb-0">
      <Navbar />
      <main className="max-w-7xl mx-auto px-2 sm:px-6">{children}</main>
      <Footer />
      <MobileCustomerBottomNav />
    </div>
  );
};

export default layout;
