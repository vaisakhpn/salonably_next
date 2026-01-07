import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default layout;
